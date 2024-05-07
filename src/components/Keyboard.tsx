import { KeyboardLetter } from "@/hooks/useWordle";

const firstRowKeys = ['Q','W','E','R','T','Y','U','I','O','P'];
const secondRowKeys = ['A','S','D','F','G','H','J','K','L'];
const thirdRowKeys = ['Z','X','C','V','B','N','M',];

export default function Keyboard ({ keyboardKeys }: { keyboardKeys: Record<string, KeyboardLetter['state']> }) {
  const keyClick = (key: string) => () => {
    console.log(`Clicked key: ${key}`);
  };

  return (
    <div className="Keyboard">
      <div className="Keyboard__row Keyboard__row--first">
        {firstRowKeys.map((k) => (
          <button
            key={k}
            className={`Keyboard__key Keyboard__key--${k} Keyboard__key--${keyboardKeys[k]}`}
            data-key={k}
            onClick={keyClick(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="Keyboard__row Keyboard__row--second">
        <div key="SPACER-LEFT" className="Keyboard__key--spacer" />
        
        {secondRowKeys.map((k) => (
          <button
            key={k}
            className={`Keyboard__key Keyboard__key--${k} Keyboard__key--${keyboardKeys[k]}`}
            data-key={k}
            onClick={keyClick(k)}
          >
            {k}
          </button>
        ))}
        
        <div key="SPACER-RIGHT" className="Keyboard__key--spacer" />
      </div>

      <div className="Keyboard__row Keyboard__row--third">
        <button
          key='enter'
          className="Keyboard__key Keyboard__key--enter Keyboard__key--default"
          data-key="enter"
          onClick={() => keyClick('enter')}
        >
          ENTER
        </button>

        {thirdRowKeys.map((k) => (
          <button
            key={k}
            className={`Keyboard__key Keyboard__key--${k} Keyboard__key--${keyboardKeys[k]}`}
            data-key={k}
            onClick={() => keyClick(k)}
          >
            {k}
          </button>
        ))}

        <button
          key='backspace'
          className="Keyboard__key Keyboard__key--backspace Keyboard__key--default"
          data-key="backspace"
          onClick={() => keyClick('backspace')}
        >
          <i className="fa-solid fa-delete-left" />
        </button>
      </div>
    </div>
  );
}