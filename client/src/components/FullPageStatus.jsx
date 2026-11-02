import Spinner from "./Spinner";

const FullPageStatus = () => {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-50 text-slate-500">
      <Spinner size="lg" label="Vérification de votre session..." />
    </div>
  )
}

export default FullPageStatus



