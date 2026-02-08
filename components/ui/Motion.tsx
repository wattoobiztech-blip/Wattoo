// Simple motion wrapper to replace framer-motion
// This provides basic animations using CSS transitions

import React from 'react';

export const useAnimationFrame = (callback: (time: number, delta: number) => void) => {
  // Use useRef for callback to avoid re-binding effect on callback change
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(time, deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);
};


export const motion = {
  div: React.forwardRef<HTMLDivElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  )),

  button: React.forwardRef<HTMLButtonElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <button ref={ref} className={className} style={style} {...props}>
      {children}
    </button>
  )),

  span: React.forwardRef<HTMLSpanElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <span ref={ref} className={className} style={style} {...props}>
      {children}
    </span>
  )),

  label: React.forwardRef<HTMLLabelElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <label ref={ref} className={className} style={style} {...props}>
      {children}
    </label>
  )),

  p: React.forwardRef<HTMLParagraphElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <p ref={ref} className={className} style={style} {...props}>
      {children}
    </p>
  )),

  tr: React.forwardRef<HTMLTableRowElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <tr ref={ref} className={className} style={style} {...props}>
      {children}
    </tr>
  )),

  td: React.forwardRef<HTMLTableCellElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <td ref={ref} className={className} style={style} {...props}>
      {children}
    </td>
  )),

  th: React.forwardRef<HTMLTableHeaderCellElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <th ref={ref} className={className} style={style} {...props}>
      {children}
    </th>
  )),

  table: React.forwardRef<HTMLTableElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <table ref={ref} className={className} style={style} {...props}>
      {children}
    </table>
  )),

  tbody: React.forwardRef<HTMLTableSectionElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <tbody ref={ref} className={className} style={style} {...props}>
      {children}
    </tbody>
  )),

  thead: React.forwardRef<HTMLTableSectionElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <thead ref={ref} className={className} style={style} {...props}>
      {children}
    </thead>
  )),

  ul: React.forwardRef<HTMLUListElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <ul ref={ref} className={className} style={style} {...props}>
      {children}
    </ul>
  )),

  li: React.forwardRef<HTMLLIElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <li ref={ref} className={className} style={style} {...props}>
      {children}
    </li>
  )),

  form: React.forwardRef<HTMLFormElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <form ref={ref} className={className} style={style} {...props}>
      {children}
    </form>
  )),

  input: React.forwardRef<HTMLInputElement, any>(({ className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <input ref={ref} className={className} style={style} {...props} />
  )),

  textarea: React.forwardRef<HTMLTextAreaElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <textarea ref={ref} className={className} style={style} {...props}>
      {children}
    </textarea>
  )),

  select: React.forwardRef<HTMLSelectElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <select ref={ref} className={className} style={style} {...props}>
      {children}
    </select>
  )),

  img: React.forwardRef<HTMLImageElement, any>(({ className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <img ref={ref} className={className} style={style} {...props} />
  )),

  a: React.forwardRef<HTMLAnchorElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <a ref={ref} className={className} style={style} {...props}>
      {children}
    </a>
  )),

  h1: React.forwardRef<HTMLHeadingElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <h1 ref={ref} className={className} style={style} {...props}>
      {children}
    </h1>
  )),

  h2: React.forwardRef<HTMLHeadingElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <h2 ref={ref} className={className} style={style} {...props}>
      {children}
    </h2>
  )),

  h3: React.forwardRef<HTMLHeadingElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <h3 ref={ref} className={className} style={style} {...props}>
      {children}
    </h3>
  )),

  section: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <section ref={ref} className={className} style={style} {...props}>
      {children}
    </section>
  )),

  article: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <article ref={ref} className={className} style={style} {...props}>
      {children}
    </article>
  )),

  nav: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <nav ref={ref} className={className} style={style} {...props}>
      {children}
    </nav>
  )),

  header: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <header ref={ref} className={className} style={style} {...props}>
      {children}
    </header>
  )),

  footer: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <footer ref={ref} className={className} style={style} {...props}>
      {children}
    </footer>
  )),

  main: React.forwardRef<HTMLElement, any>(({ children, className, style, initial, animate, transition, whileHover, whileTap, viewport, variants, exit, ...props }, ref) => (
    // eslint-disable-next-line react-forbid-dom-props
    <main ref={ref} className={className} style={style} {...props}>
      {children}
    </main>
  )),
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

motion.div.displayName = 'motion.div';
motion.button.displayName = 'motion.button';
motion.span.displayName = 'motion.span';
motion.label.displayName = 'motion.label';
motion.p.displayName = 'motion.p';
motion.tr.displayName = 'motion.tr';
motion.td.displayName = 'motion.td';
motion.th.displayName = 'motion.th';
motion.table.displayName = 'motion.table';
motion.tbody.displayName = 'motion.tbody';
motion.thead.displayName = 'motion.thead';
motion.ul.displayName = 'motion.ul';
motion.li.displayName = 'motion.li';
motion.form.displayName = 'motion.form';
motion.input.displayName = 'motion.input';
motion.textarea.displayName = 'motion.textarea';
motion.select.displayName = 'motion.select';
motion.img.displayName = 'motion.img';
motion.a.displayName = 'motion.a';
motion.h1.displayName = 'motion.h1';
motion.h2.displayName = 'motion.h2';
motion.h3.displayName = 'motion.h3';
motion.section.displayName = 'motion.section';
motion.article.displayName = 'motion.article';
motion.nav.displayName = 'motion.nav';
motion.header.displayName = 'motion.header';
motion.footer.displayName = 'motion.footer';
motion.main.displayName = 'motion.main';
