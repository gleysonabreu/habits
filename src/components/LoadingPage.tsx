import { Logo } from './Logo';

export function LoadingPage() {
  return (
    <div className="flex fixed w-full h-full top-0 justify-center items-center z-50 left-0 bg-gray-950">
      <div className="animate-bounce">
        <Logo />
      </div>
    </div>
  );
}
