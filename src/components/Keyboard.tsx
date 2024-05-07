import { KeyboardLetter } from "@/hooks/useWordle";

const firstRowKeys = ['Q','W','E','R','T','Y','U','I','O','P'];
const secondRowKeys = ['SPACER-LEFT','A','S','D','F','G','H','J','K','L','SPACER-RIGHT'];
const thirdRowKeys = ['ENTER','Z','X','C','V','B','N','M','BACKSPACE'];

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
        {secondRowKeys.map((k) => (
          k === 'SPACER-LEFT' || k === 'SPACER-RIGHT' ? (
            <div key={k} className="Keyboard__key--spacer"></div>
          ) : (
            <button
              key={k}
              className={`Keyboard__key Keyboard__key--${k} Keyboard__key--${keyboardKeys[k]}`}
              data-key={k}
              onClick={keyClick(k)}
            >
              {k}
            </button>
          )
        ))}
      </div>

      <div className="Keyboard__row Keyboard__row--third">
        {thirdRowKeys.map((k) => (
          <button
            key={k}
            className={`Keyboard__key Keyboard__key--${k} Keyboard__key--${keyboardKeys[k]}`}
            data-key={k}
            onClick={() => keyClick(k)}
          >
            {k === 'BACKSPACE' ? (
              <i className="fa-solid fa-delete-left"></i>
            ) : k}
          </button>
        ))}
      </div>
    </div>
  );
}