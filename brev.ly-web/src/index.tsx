import { MyLinks } from './Components/My-Links';
import { NewFolder } from './Components/New-Folder';

export function App() {

  return (
      <div className="flex md:items-center justify-center min-h-screen mt-4 md:mt-0 bg-gray-200 font-sans px-3">
        <div className="flex flex-col 2xl:flex-row justify-center gap-6 items-center md:items-start">
          <img src="Logo.svg" className="w-24 sm:w-28 md:w-32 h-auto" alt="Logo" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
            <NewFolder />
            <MyLinks />
          </div>
        </div>
      </div>
  );
}