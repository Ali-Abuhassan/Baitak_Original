
// import React from "react";

// const steps = [
//   { number: 1, title: "Create Account", description: "Sign up and set up your profile in minutes" },
//   { number: 2, title: "Choose Plan", description: "Select the perfect plan for your needs" },
//   { number: 3, title: "Start Building", description: "Begin creating amazing projects right away" },
//   { number: 4, title: "Go Live", description: "Launch your project and share with the world" },
// ];

// export default function HowItWorks() {
//   // Coordinates in SVG viewBox space (0..1000 across). Adjust if you change count or spacing.
//   const xs = [125, 375, 625, 875]; // centers for 4 items in a 1000-wide viewBox
//   const y = 100; // vertical center in viewBox (circle center)
//   const curveHeight = 45; // how "tall" the curves are (increase -> more dramatic)

//   return (
//     <div className="w-full bg-[#F1F8F2] py-20">
//       <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">How Baitak Works</h2>
//       <p className="text-center text-gray-600 mb-12">Get your home services done in 4 simple steps</p>

//       {/* ROOT container: fixed height to align circles & SVG. Adjust h-72 as you need. */}
//       <div className="relative max-w-7xl mx-auto h-72">
//         {/* SVG overlay (full width/height of the container) */}
//         <svg
//           className="absolute inset-0 w-semi-full h-full pointer-events-none z-0"
//           viewBox="0 0 1000 200"
//           preserveAspectRatio="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <defs>
//             <marker id="arrow" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
//               <polygon points="0 0, 7 5, 0 10" fill="#059669" />
//             </marker>
//           </defs>

//           {/* Draw each connecting curved path between consecutive xs */}
//           {xs.map((x, i) => {
//             if (i === xs.length - 1) return null;
//             const x1 = x;
//             const x2 = xs[i + 1];
//             const mid = (x1 + x2) / 2;
//             // alternate curve direction by adding/subtracting control point y offset
//             const controlY = i % 2 === 0 ? y - curveHeight : y + curveHeight;
//             // Quadratic bezier: M x1,y Q mid,controlY x2,y
//             const d = `M ${x1} ${y} Q ${mid} ${controlY} ${x2} ${y}`;
//             return (
//               <path
//                 key={i}
//                 d={d}
//                 stroke="#059669"
//                 strokeWidth="4"
//                 strokeDasharray="12 7"
//                 strokeLinecap="round"
//                 fill="none"
//                 markerEnd="url(#arrow)"
//               />
//             );
//           })}
//         </svg>

//         {/* Grid of steps; circles are above SVG with z-10 */}
//         <div className="grid grid-cols-4 h-full items-start">
//           {steps.map((step, idx) => (
//             <div key={step.number} className="flex flex-col items-center">
//               {/* We place the circle so its center aligns with the SVG's y coordinate.
//                   The container height is 72 (h-72). The SVG center is at viewBox y=100 which maps to
//                   50% of the container height. So we push the circle down by 50% minus half the circle height. */}
//               <div
//                 className="relative z-10"
//                 style={{
//                   marginTop: "calc(50% - 40px)" /* half container (center) minus half circle size (40px) */
//                 }}
//               >
//                 <div className="w-20 h-20 bg-green-600 text-white rounded-full shadow-lg
//                                 flex items-center justify-center text-2xl font-semibold">
//                   {step.number}
//                 </div>
//               </div>

//               {/* Title and description below the circle */}
//               <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2 text-center">{step.title}</h3>
//               <p className="text-gray-600 text-center max-w-[260px] leading-relaxed mt-0">
//                 {step.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// HowItWorks.jsx
import React from "react";

/**
 * Reference image (local file) available at:
 * /mnt/data/ee06de5f-f11d-417f-9c97-979dc848aaa6.png
 *
 * Paste this file into your app and render <HowItWorks /> where needed.
 */

export default function HowItWorks() {
  return (
    <section className="relative bg-emerald-50 py-16 overflow-hidden">
      {/* Optional reference image (hidden visually) */}
      <img
        src="/mnt/data/ee06de5f-f11d-417f-9c97-979dc848aaa6.png"
        alt="reference"
        className="sr-only"
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900">How Baitak Works</h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">Get your home services done in 4 simple steps</p>
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* SVG overlay with dashed curved arrows */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Curve from step1 to step2 */}
            <path
              d="M 90 120 C 180 70, 300 40, 360 110"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 10"
              markerEnd="url(#arrow)"
              opacity="0.95"
            />
            {/* Curve from step2 to step3 */}
            <path
              d="M 420 110 C 520 160, 680 160, 750 110"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 10"
              markerEnd="url(#arrow)"
              opacity="0.95"
            />
            {/* Curve from step3 to step4 */}
            <path
              d="M 810 110 C 880 80, 980 60, 1080 110"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 10"
              markerEnd="url(#arrow)"
              opacity="0.95"
            />
          </svg>

          {/* Steps row */}
          <div className="grid grid-cols-4 gap-6 items-start relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-semibold shadow">
                1
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Search Service</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-[220px]">
                Browse categories or use voice search to find the service you need
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-semibold shadow">
                2
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Choose Provider</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-[220px]">
                Review verified providers with ratings and select the best match
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-semibold shadow">
                3
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Book &amp; Schedule</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-[220px]">
                Set your budget, schedule the service, and confirm booking
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-semibold shadow">
                4
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Get It Done</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-[220px]">
                Professional completes the work and you rate the experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
