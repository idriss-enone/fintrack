import AuthHero from "../AuthHero";
import { Wallet } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-white ">
      <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 py-8 order-1">
        <div className="flex justify-start items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">FinTrack</span>
        </div>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      {/** */}
      <aside
        className=" hidden lg:flex lg:w-1/2 xl:w-[55%] order-2"
        aria-hidden="true"
      >
        <AuthHero headline="Maîtrisez" subheadline="votre avenir financier" />
      </aside>
    </div>
  );
};

export default AuthLayout;
