import React from "react";
import logoImage from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const companiesLogo = [
    {
      logo: (
        <svg
          className="h-7 w-auto max-w-xs"
          width="128"
          height="42"
          viewBox="0 0 128 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0H27.7325V14H13.8663L0 0ZM0 14H13.8663L27.7325 28H0V14ZM0 28H13.8663V42L0 28Z" fill="#90A1B9" />
          <path d="M43.3801 11.0446H54.5901V14.6412H47.6231V19.6392H54.5901V23.1564H47.6231V29.5559H43.3801V11.0446ZM56.8949 16.8094H60.9025V19.4804C61.1118 18.5625 61.5401 17.8579 62.1859 17.3647C62.8482 16.8529 63.5835 16.598 64.386 16.598C64.8054 16.598 65.1549 16.6339 65.4334 16.7037V20.4591C65.0337 20.4104 64.6315 20.3842 64.2287 20.3797C63.1286 20.3797 62.3001 20.7403 61.7405 21.4634C61.1829 22.1687 60.9025 23.2262 60.9025 24.6373V29.5559H56.8968V16.8094H56.8949ZM71.7597 29.8998C70.5379 29.8998 69.4721 29.6084 68.5642 29.0268C67.6735 28.4452 66.9655 27.6196 66.5214 26.6466C66.0501 25.625 65.8128 24.4688 65.8128 23.1826C65.8128 21.9131 66.059 20.7666 66.5474 19.7449C67.0055 18.7579 67.7325 17.9233 68.6429 17.3385C69.5672 16.7569 70.6241 16.4654 71.8124 16.4654C72.7025 16.4654 73.498 16.6601 74.1959 17.0477C74.8937 17.4365 75.4177 17.9655 75.7673 18.6342V16.8094H79.7482V29.5559H75.7673V27.7573C75.4177 28.392 74.8766 28.9115 74.1432 29.3176C73.4098 29.7102 72.5902 29.9101 71.7597 29.8998ZM72.9125 26.5409C73.8723 26.5409 74.6146 26.2238 75.1386 25.5891C75.6626 24.9543 75.9246 24.1517 75.9246 23.1826C75.9246 22.2308 75.6626 21.4372 75.1386 20.8024C74.6146 20.1677 73.8723 19.8506 72.9125 19.8506C72.0033 19.8506 71.2712 20.1587 70.7123 20.7762C70.1712 21.3936 69.9003 22.1949 69.9003 23.1826C69.9003 24.1703 70.1712 24.9806 70.7123 25.6153C71.2712 26.2328 72.0046 26.5409 72.9125 26.5409ZM82.551 16.8094H86.5586V18.6605C86.839 18.0072 87.2919 17.4781 87.92 17.0739C88.5671 16.6697 89.3176 16.4654 90.1728 16.4654C92.1636 16.4654 93.4825 17.2494 94.1277 18.8194C94.483 18.1077 95.0387 17.5191 95.7258 17.1271C96.4604 16.6806 97.3042 16.452 98.1613 16.4654C101.147 16.4654 102.64 18.1923 102.64 21.6486V29.5559H98.6066V22.389C98.6066 21.5262 98.4493 20.8915 98.1352 20.4854C97.8206 20.0805 97.3492 19.8769 96.7205 19.8769C96.0398 19.8769 95.5158 20.1151 95.1491 20.591C94.7824 21.0497 94.5991 21.851 94.5991 22.9975V29.5559H90.5655V22.3627C90.5655 21.4993 90.4088 20.8729 90.0941 20.4854C89.7985 20.0805 89.3347 19.8769 88.7073 19.8769C88.0082 19.8769 87.4753 20.1151 87.1086 20.591C86.7419 21.0497 86.5586 21.851 86.5586 22.9975V29.5559H82.5523V16.8094H82.551ZM117.695 22.5216C117.695 23.0673 117.659 23.6585 117.588 24.2933H108.265C108.301 25.1221 108.58 25.7556 109.104 26.1976C109.628 26.6376 110.336 26.8586 111.225 26.8586C112.465 26.8586 113.251 26.4788 113.582 25.721H117.511C117.318 26.9733 116.638 27.9859 115.468 28.7623C114.316 29.52 112.901 29.8998 111.225 29.8998C109.06 29.8998 107.358 29.3086 106.117 28.1275C104.896 26.9457 104.284 25.2983 104.284 23.1826C104.284 21.8074 104.563 20.6173 105.122 19.6123C105.662 18.6086 106.494 17.7964 107.505 17.2853C108.536 16.7396 109.732 16.4654 111.096 16.4654C112.387 16.4654 113.53 16.721 114.525 17.2328C115.538 17.7445 116.315 18.4581 116.856 19.3747C117.416 20.2926 117.695 21.3411 117.695 22.5216ZM113.738 21.7812C113.721 20.935 113.485 20.2906 113.031 19.8506C112.578 19.4106 111.922 19.1896 111.066 19.1896C110.211 19.1896 109.53 19.4272 109.024 19.9038C108.535 20.3624 108.282 20.9875 108.264 21.7812H113.738ZM119.462 16.8094H123.469V19.4804C123.678 18.5625 124.107 17.8579 124.752 17.3647C125.379 16.8664 126.155 16.5961 126.953 16.598C127.371 16.598 127.721 16.6339 128 16.7037V20.4591C127.6 20.4104 127.198 20.3842 126.795 20.3797C125.695 20.3797 124.867 20.7403 124.307 21.4634C123.748 22.1687 123.469 23.2262 123.469 24.6373V29.5559H119.462V16.8094Z" fill="#90A1B9" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen pb-20">
        <nav className="z-50 flex w-full items-center justify-between px-6 py-4 text-sm md:px-16 lg:px-24 xl:px-40">
          <a href="/">
            <img src={logoImage} alt="Resume.com logo" className="h-15 w-auto" />
          </a>

          <div className="hidden items-center gap-8 text-slate-800 transition duration-500 md:flex">
            <Link to="/" className="transition hover:text-indigo-600">Home</Link>
            <Link to="/" className="transition hover:text-indigo-600">Features</Link>
            <Link to="#testimonials" className="transition hover:text-indigo-600">Testimonials</Link>
            <Link to="#cta" className="transition hover:text-indigo-600">Contact</Link>
          </div>

          <div className="flex gap-2">
            <Link to="/resumeAn" className="hidden rounded-full bg-indigo-500 px-6 py-2 text-white transition-all hover:bg-indigo-700 active:scale-95 md:block">
              Get started
            </Link>
            <Link to="/login" className="hidden rounded-full border px-6 py-2 text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 md:block">
              Login
            </Link>
          </div>

          <button onClick={() => setMenuOpen(true)} className="transition active:scale-90 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu">
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </nav>

        <div className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-black/40 text-lg text-black backdrop-blur transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <a href="/" className="text-white">Home</a>
          <a href="/products" className="text-white">Products</a>
          <a href="/stories" className="text-white">Stories</a>
          <a href="/pricing" className="text-white">Pricing</a>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex size-10 items-center justify-center rounded-md bg-indigo-600 p-1 text-white transition hover:bg-indigo-700 active:ring-[3px] active:ring-white"
          >
            X
          </button>
        </div>

        <div className="relative flex flex-col items-center justify-center px-4 text-sm text-black md:px-16 lg:px-24 xl:px-40">
          <div className="absolute left-1/4 top-28 -z-10 size-72 bg-indigo-300 opacity-30 blur-[100px] sm:size-96 xl:top-10 xl:size-120 2xl:size-132"></div>

          <div className="mt-24 flex items-center">
            <div className="-space-x-3 flex pr-3">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="z-1 size-8 rounded-full border-2 border-white object-cover transition hover:-translate-y-0.5" />
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="z-2 size-8 rounded-full border-2 border-white object-cover transition hover:-translate-y-0.5" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="z-3 size-8 rounded-full border-2 border-white object-cover transition hover:-translate-y-0.5" />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="z-4 size-8 rounded-full border-2 border-white object-cover transition hover:-translate-y-0.5" />
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="z-5 size-8 rounded-full border-2 border-white transition hover:-translate-y-0.5" />
            </div>

            <div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star fill-indigo-600 text-transparent"
                    aria-hidden="true"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700">Used by 10,000+ users</p>
            </div>
          </div>

          <h1 className="mt-4 max-w-5xl text-center text-5xl font-semibold md:text-6xl md:leading-17.5">
            Optimize your future with{" "}
            <span className="bg-linear-to-r from-indigo-700 to-indigo-600 bg-clip-text text-nowrap text-transparent">
              resume.    
            </span>{" "}
            AI Analyzer
          </h1>

          <p className="my-7 max-w-md text-center text-base">
            Explore different features that can help you to improve resume and even yourself.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/resumeAn" className="m-1 flex h-12 items-center rounded-full bg-indigo-500 px-9 text-white ring-1 ring-indigo-400 ring-offset-2 transition-colors hover:bg-indigo-600">
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 size-4" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>

            {/* <button className="flex h-12 items-center gap-2 rounded-full border border-slate-400 px-7 text-slate-700 transition hover:bg-indigo-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video size-5" aria-hidden="true">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
              
            </button> */}
          </div>

          <p className="mt-14 py-6 text-slate-600">Trusting by leading brands</p>

          <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-between gap-6 py-4 max-sm:justify-center" id="logo-container">
            {companiesLogo.map((company, index) => (
              <React.Fragment key={index}>{company.logo}</React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
          * {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default HeroSection;
