// "use client";
// import Link from "next/link";
// import type { NextPage } from "next";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
// const Home: NextPage = () => {
//   const { address: connectedAddress } = useAccount();
//   return (
//     <>
//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center">
//             <span className="block text-2xl mb-2">Welcome to</span>
//             <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
//           </h1>
//           <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
//             <p className="my-2 font-medium">Connected Address:</p>
//             <Address address={connectedAddress} />
//           </div>
//           <p className="text-center text-lg">
//             Get started by editing{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/nextjs/app/page.tsx
//             </code>
//           </p>
//           <p className="text-center text-lg">
//             Edit your smart contract{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               YourContract.sol
//             </code>{" "}
//             in{" "}
//             <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
//               packages/hardhat/contracts
//             </code>
//           </p>
//         </div>
//         <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
//           <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
//             <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BugAntIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Tinker with your smart contract using the{" "}
//                 <Link href="/debug" passHref className="link">
//                   Debug Contracts
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Explore your local transactions with the{" "}
//                 <Link href="/blockexplorer" passHref className="link">
//                   Block Explorer
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Home;
import Link from "next/link";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-base-300 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-extrabold text-primary mb-4">Bohemian Voting Platform</h1>
      <p className="text-lg text-gray-400 mb-12 max-w-2xl">
        Welcome! Start a new election or explore existing ones to make your vote count.
      </p>

      <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl">
        {/* Create Election Section */}
        <div className="group flex-1 bg-base-200 p-10 rounded-lg shadow-lg hover:bg-base-100 transition-all duration-300">
          <div className="flex flex-col items-center">
            <PlusCircleIcon className="h-16 w-16 text-primary mb-4 transition-transform group-hover:scale-110" />
            <h2 className="text-3xl font-bold text-primary mb-2">Create an Election</h2>
            <p className="text-gray-300 text-base">Set up a new election with candidates, voting options, and more.</p>
            <Link href="/create">
              <button className="btn btn-outline btn-primary mt-6 group-hover:scale-105 transition-transform">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* View Elections Section */}
        <div className="group flex-1 bg-base-200 p-10 rounded-lg shadow-lg hover:bg-base-100 transition-all duration-300">
          <div className="flex flex-col items-center">
            <MagnifyingGlassIcon className="h-16 w-16 text-secondary mb-4 transition-transform group-hover:scale-110" />
            <h2 className="text-3xl font-bold text-primary mb-2">View Elections</h2>
            <p className="text-gray-300 text-base">Browse ongoing and past elections to see results and participate.</p>
            <Link href="/view">
              <button className="btn btn-outline btn-primary mt-6 group-hover:scale-105 transition-transform">
                Explore Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
