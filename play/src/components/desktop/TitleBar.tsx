import { Gamepad2Icon } from 'lucide-react';

export default function TitleBar() {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    } else {
      console.log('Minimize not available in web version');
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    } else {
      console.log('Maximize not available in web version');
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    } else {
      console.log('Close not available in web version');
    }
  };

  return (
    <div className="titlebar flex justify-between h-9 shrink-0 items-baseline">
      <div className="flex text-sm font-semibold text-muted-foreground ml-3 items-center self-center">
        <Gamepad2Icon className="size-5 mr-1 text-primary" />
        <p>Trabalho APSOO</p>
      </div>
      <div className='absolute top-0 right-0'>
        <button onClick={handleMinimize} className="titlebar-button hover:bg-primary/40" tabIndex={-1}>
          &#x2013;
        </button>
        <button onClick={handleMaximize} className="titlebar-button hover:bg-primary/40" tabIndex={-1}>
          &#x25A1;
        </button>
        <button onClick={handleClose} className="titlebar-button hover:bg-destructive/40" tabIndex={-1}>
          &#x2715;
        </button>
      </div>
    </div>
  );
};