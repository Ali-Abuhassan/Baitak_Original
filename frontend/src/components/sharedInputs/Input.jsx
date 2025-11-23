// // // src/components/sharedInputs/Input.jsx
// // import React from 'react';
// // import { cn } from '../../utils/cn'; // adjust path if you use relative imports

// // const base =
// //   'w-full rounded-xl border focus:outline-none focus:ring-2 transition-all ring-offset-2';
// // const variants = {
// //   outline: 'bg-white border-gray-300 focus:ring-primary',
// //   filled: 'bg-[#F4F4F4] border-transparent focus:bg-white focus:ring-primary',
// // };
// // const sizes = {
// //   sm: 'px-3 py-1.5 text-sm',
// //   md: 'px-4 py-2',
// //   lg: 'px-5 py-3 text-base',
// // };

// // export function Input({
// //   variant = 'outline',
// //   size = 'md',
// //   className = '',
// //   ...props
// // }) {
// //   return (
// //     <input
// //       {...props}
// //       className={cn(base, variants[variant] || variants.outline, sizes[size] || sizes.md, className)}
// //     />
// //   );
// // }

// // export default Input;
import React from 'react';
import { cn } from '../../utils/cn' // optional helper; if you don't have it, replace cn(...) with template strings

// A simple Input that supports variant & size without external deps
const styleBase = 'block w-full rounded-md transition-shadow placeholder-gray-500';
const variants = {
  filled: 'bg-gray-100 text-gray-900 py-3 px-4',
  outline: 'bg-white border border-gray-200 text-gray-900 py-2 px-3',
};

const sizes = {
  md: '',
  sm: 'py-2 px-3 text-sm',
  lg: 'py-4 px-5 text-lg',
};

const Input = React.forwardRef(({ className = '', variant = 'filled', size = 'md', ...props }, ref) => {
  const classes = `${styleBase} ${variants[variant] ?? variants.filled} ${sizes[size] ?? ''} ${className}`;
  return <input ref={ref} className={classes} {...props} />;
});
Input.displayName = 'Input';
export default Input;
