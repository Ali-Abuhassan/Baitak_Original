// // // src/components/sharedInputs/Select.jsx
// // import React from 'react';
// // import { cn } from '../../utils/cn';

// // const base =
// //   'w-full rounded-xl border focus:outline-none focus:ring-2 transition-all ring-offset-2 bg-white';
// // const variants = {
// //   outline: 'border-gray-300 focus:ring-[#1A3D64]',
// //   filled: 'bg-[#F4F4F4] border-transparent focus:bg-white focus:ring-[#1A3D64]',
// // };
// // const sizes = {
// //   sm: 'px-3 py-1.5 text-sm',
// //   md: 'px-4 py-2',
// //   lg: 'px-5 py-3 text-base',
// // };

// // export function Select({
// //   variant = 'outline',
// //   size = 'md',
// //   className = '',
// //   loading = false,
// //   placeholder = 'Select',
// //   children,
// //   disabled = false,
// //   ...props
// // }) {
// //   return (
// //     <select
// //       {...props}
// //       disabled={disabled || loading}
// //       className={cn(base, variants[variant] || variants.outline, sizes[size] || sizes.md, className)}
// //     >
// //       {loading ? (
// //         <option value="">{placeholder}</option>
// //       ) : (
// //         children
// //       )}
// //     </select>
// //   );
// // }

// // export default Select;
import React from 'react';

const styleBase = 'block w-full rounded-md transition-shadow text-gray-800';
const variants = {
  filled: 'bg-gray-100 py-3 px-4',
  outline: 'bg-white border border-gray-200 py-2 px-3',
};

const Select = React.forwardRef(({ children, className = '', variant = 'filled', size = 'md', disabled = false, ...props }, ref) => {
  const classes = `${styleBase} ${variants[variant] ?? variants.filled} ${className}`;
  return (
    <div className="relative">
      <select  ref={ref} className={classes} disabled={disabled} {...props}>
        {children}
      </select>
      {/* simple arrow to the right */}
      {/* <div className="pointer-events-none  absolute inset-y-0 right-3 flex items-center">
        <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div> */}
    </div>
  );
});
Select.displayName = 'Select';
export default Select;
