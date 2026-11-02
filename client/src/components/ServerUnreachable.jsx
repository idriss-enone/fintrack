import { WifiOff } from "lucide-react";
import Button from "./ui/Button";

const ServerUnreachable = ({ retry }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="grid min-h-dvh place-items-center bg-slate-50 px-6 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <div
          className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"
          aria-hidden="true"
        >
          <WifiOff size={24} />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Serveur injoignable
        </h1>

        <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
          Impossible de joindre le serveur. Vérifiez votre connexion, puis
          réessayez. Votre session est conservée.
        </p>

        <Button
          type="button"
          onClick={retry}
          className="w-full rounded-lg bg-violet-600 px-6 py-2.5 font-medium text-white shadow-xs transition hover:bg-violet-700 sm:w-auto"
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default ServerUnreachable;
