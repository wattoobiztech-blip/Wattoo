const DatabaseUtils = require('../utils/database');
const Helpers = require('../utils/helpers');

class Subscription {
  
  // Subscription plans configuration
  static plans = {
    free: {
      name: 'Free',
      price: 0,
      duration: 365, // days
      features: {
        profileViews: 5,
        interestsPerDay: 2,
        advancedSearch: false,
        prioritySupport: false,
        profileBoost: false,
        hideAds: false
      }
    },
    golden: {
      name: 'Golden',
      price: 29.99,
      duration: 30, // days
      features: {
        profileViews: 50,
        interestsPerDay: 10,
        advancedSearch: true,
        prioritySupport: false,
        profileBoost: true,
        hideAds: true
      }
    },
    diamond: {
      name: 'Diamond',
      price: 59.99,
      duration: 30, // days
      features: {
        profileViews: 100,
        interestsPerDay: 25,
        advancedSearch: true,
        prioritySupport: true,
        profileBoost: true,
        hideAds: true
      }
    },
    elite: {
      name: 'Elite',
      price: 99.99,
      duration: 30, // days
      features: {
        profileViews: -1, // unlimited
        interestsPerDay: -1, // unlimited
        advancedSearch: true,
        prioritySupport: true,
        profileBoost: true,
        hideAds: true
      }
    }
  };

  // Create new subscription
  static async create(subscriptionData) {
    try {
      const plan = this.plans[subscriptionData.planType];
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.duration);

      const subscriptionId = await DatabaseUtils.insert('subscriptions', {
        user_id: subscriptionData.userId,
        plan_type: subscriptionData.planType,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        payment_method: subscriptionData.paymentMethod,
        amount: plan.price,
        currency: subscriptionData.currency || 'USD',
        transaction_id: subscriptionData.transactionId,
        auto_renew: subscriptionData.autoRenew || false,
        features: JSON.stringify(plan.features),
        created_at: new Date()
      });

      return await this.findById(subscriptionId);
    } catch (error) {
      throw error;
    }
  }

  // Find subscription by ID
  static async findById(subscriptionId) {
    const query = `
      SELECT s.*, u.email, u.full_name, p.name as profile_name
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE s.id = ?
    `;
    
    const subscriptions = await DatabaseUtils.query(query, [subscriptionId]);
    const subscription = subscriptions[0];
    
    if (subscription && subscription.features) {
      subscription.features = JSON.parse(subscription.features);
    }
    
    return subscription || null;
  }

  // Find active subscription by user ID
  static async findActiveByUserId(userId) {
    const query = `
      SELECT * FROM subscriptions 
      WHERE user_id = ? AND status = 'active' AND end_date > CURDATE()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const subscriptions = await DatabaseUtils.query(query, [userId]);
    const subscription = subscriptions[0];
    
    if (subscription && subscription.features) {
      subscription.features = JSON.parse(subscription.features);
    }
    
    return subscription || null;
  }

  // Get user's subscription history
  static async getUserHistory(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM subscriptions
      WHERE user_id = ?
    `;

    const dataQuery = `
      SELECT * FROM subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, subscriptions] = await Promise.all([
      DatabaseUtils.query(countQuery, [userId]),
      DatabaseUtils.query(dataQuery, [userId, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse features JSON for each subscription
    const parsedSubscriptions = subscriptions.map(sub => {
      if (sub.features) {
        sub.features = JSON.parse(sub.features);
      }
      return sub;
    });

    return {
      subscriptions: parsedSubscriptions,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Update subscription
  static async update(subscriptionId, updateData) {
    const cleanData = Helpers.cleanObject(updateData);
    cleanData.updated_at = new Date();

    if (cleanData.features && typeof cleanData.features === 'object') {
      cleanData.features = JSON.stringify(cleanData.features);
    }

    const affectedRows = await DatabaseUtils.update('subscriptions', cleanData, { id: subscriptionId });
    
    if (affectedRows === 0) {
      throw new Error('Subscription not found');
    }

    return await this.findById(subscriptionId);
  }

  // Cancel subscription
  static async cancel(subscriptionId, reason = null) {
    await DatabaseUtils.update('subscriptions', {
      status: 'cancelled',
      auto_renew: false,
      updated_at: new Date()
    }, { id: subscriptionId });

    // Log cancellation reason if provided
    if (reason) {
      const subscription = await this.findById(subscriptionId);
      await this.logSubscriptionAction(subscription.user_id, 'cancelled', { reason });
    }

    return await this.findById(subscriptionId);
  }

  // Renew subscription
  static async renew(subscriptionId, paymentData) {
    const subscription = await this.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const plan = this.plans[subscription.plan_type];
    const newEndDate = new Date(subscription.end_date);
    newEndDate.setDate(newEndDate.getDate() + plan.duration);

    await DatabaseUtils.update('subscriptions', {
      end_date: newEndDate,
      status: 'active',
      transaction_id: paymentData.transactionId,
      updated_at: new Date()
    }, { id: subscriptionId });

    // Create payment record
    await this.createPaymentRecord({
      userId: subscription.user_id,
      subscriptionId: subscriptionId,
      amount: plan.price,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      status: 'completed'
    });

    return await this.findById(subscriptionId);
  }

  // Check if subscription is expired
  static async checkExpired(subscriptionId) {
    const subscription = await this.findById(subscriptionId);
    if (!subscription) return true;

    const now = new Date();
    const endDate = new Date(subscription.end_date);
    
    return now > endDate;
  }

  // Expire subscriptions (run as cron job)
  static async expireSubscriptions() {
    const expiredCount = await DatabaseUtils.query(`
      UPDATE subscriptions 
      SET status = 'expired', updated_at = NOW()
      WHERE status = 'active' AND end_date < CURDATE()
    `);

    return expiredCount[0]?.affectedRows || 0;
  }

  // Get all subscriptions (admin)
  static async getAll(page = 1, limit = 20, filters = {}) {
    let whereConditions = [];
    let params = [];

    if (filters.planType) {
      whereConditions.push('s.plan_type = ?');
      params.push(filters.planType);
    }

    if (filters.status) {
      whereConditions.push('s.status = ?');
      params.push(filters.status);
    }

    if (filters.search) {
      whereConditions.push('(u.full_name LIKE ? OR u.email LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT s.*, u.email, u.full_name, p.name as profile_name
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, subscriptions] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse features JSON for each subscription
    const parsedSubscriptions = subscriptions.map(sub => {
      if (sub.features) {
        sub.features = JSON.parse(sub.features);
      }
      return sub;
    });

    return {
      subscriptions: parsedSubscriptions,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get subscription statistics
  static async getStats() {
    const queries = [
      'SELECT COUNT(*) as total FROM subscriptions',
      'SELECT COUNT(*) as active FROM subscriptions WHERE status = "active" AND end_date > CURDATE()',
      'SELECT COUNT(*) as expired FROM subscriptions WHERE status = "expired"',
      'SELECT COUNT(*) as cancelled FROM subscriptions WHERE status = "cancelled"',
      'SELECT SUM(amount) as total_revenue FROM subscriptions WHERE status IN ("active", "expired")',
      'SELECT plan_type, COUNT(*) as count FROM subscriptions WHERE status = "active" GROUP BY plan_type'
    ];

    const results = await Promise.all(
      queries.map(query => DatabaseUtils.query(query))
    );

    const planDistribution = {};
    results[5].forEach(row => {
      planDistribution[row.plan_type] = row.count;
    });

    return {
      total: results[0][0]?.total || 0,
      active: results[1][0]?.active || 0,
      expired: results[2][0]?.expired || 0,
      cancelled: results[3][0]?.cancelled || 0,
      totalRevenue: results[4][0]?.total_revenue || 0,
      planDistribution
    };
  }

  // Create payment record
  static async createPaymentRecord(paymentData) {
    return await DatabaseUtils.insert('payments', {
      user_id: paymentData.userId,
      subscription_id: paymentData.subscriptionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      payment_method: paymentData.paymentMethod,
      transaction_id: paymentData.transactionId,
      status: paymentData.status || 'pending',
      gateway_response: paymentData.gatewayResponse ? JSON.stringify(paymentData.gatewayResponse) : null,
      payment_date: new Date()
    });
  }

  // Get payment history
  static async getPaymentHistory(page = 1, limit = 20, filters = {}) {
    let whereConditions = [];
    let params = [];

    if (filters.userId) {
      whereConditions.push('p.user_id = ?');
      params.push(filters.userId);
    }

    if (filters.status) {
      whereConditions.push('p.status = ?');
      params.push(filters.status);
    }

    if (filters.search) {
      whereConditions.push('(u.full_name LIKE ? OR u.email LIKE ? OR p.transaction_id LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT p.*, u.email, u.full_name, s.plan_type
      FROM payments p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN subscriptions s ON p.subscription_id = s.id
      ${whereClause}
      ORDER BY p.payment_date DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, payments] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse gateway response JSON
    const parsedPayments = payments.map(payment => {
      if (payment.gateway_response) {
        payment.gateway_response = JSON.parse(payment.gateway_response);
      }
      return payment;
    });

    return {
      payments: parsedPayments,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Process refund
  static async processRefund(paymentId, refundAmount, reason) {
    const payment = await DatabaseUtils.findOne('payments', { id: paymentId });
    if (!payment) {
      throw new Error('Payment not found');
    }

    await DatabaseUtils.update('payments', {
      status: 'refunded',
      refund_amount: refundAmount,
      refunded_at: new Date(),
      failure_reason: reason
    }, { id: paymentId });

    // If full refund, cancel the subscription
    if (refundAmount >= payment.amount && payment.subscription_id) {
      await this.cancel(payment.subscription_id, 'Full refund processed');
    }

    return await DatabaseUtils.findOne('payments', { id: paymentId });
  }

  // Get user's current plan features
  static async getUserFeatures(userId) {
    const subscription = await this.findActiveByUserId(userId);
    
    if (!subscription) {
      return this.plans.free.features;
    }

    return subscription.features || this.plans[subscription.plan_type].features;
  }

  // Check if user can perform action based on subscription
  static async canPerformAction(userId, action) {
    const features = await this.getUserFeatures(userId);
    
    switch (action) {
      case 'advanced_search':
        return features.advancedSearch;
      case 'priority_support':
        return features.prioritySupport;
      case 'profile_boost':
        return features.profileBoost;
      case 'hide_ads':
        return features.hideAds;
      default:
        return false;
    }
  }

  // Get usage limits for user
  static async getUsageLimits(userId) {
    const features = await this.getUserFeatures(userId);
    
    return {
      profileViews: features.profileViews,
      interestsPerDay: features.interestsPerDay
    };
  }

  // Log subscription action
  static async logSubscriptionAction(userId, action, data = {}) {
    try {
      await DatabaseUtils.insert('activity_logs', {
        user_id: userId,
        action: `subscription_${action}`,
        entity_type: 'subscription',
        new_values: JSON.stringify(data),
        created_at: new Date()
      });
    } catch (error) {
      console.error('Error logging subscription action:', error);
    }
  }

  // Get plan details
  static getPlanDetails(planType) {
    return this.plans[planType] || null;
  }

  // Get all available plans
  static getAllPlans() {
    return this.plans;
  }
}

module.exports = Subscription;