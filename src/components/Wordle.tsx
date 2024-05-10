import { useEffect } from 'react';

import Keyboard from '@/components/Keyboard';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import Stats from '@/components/Stats';

import useWordle from '@/hooks/useWordle';

type WordleProps = {
  darkMode: boolean,
  appTriggerModal: boolean,
  setAppTriggerModal: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Wordle ({ darkMode, appTriggerModal, setAppTriggerModal }: WordleProps) {  
  const {
    grid,
    guessIndex,
    shakeRow,
    keyboardKeys,
    gameOver,
    gameWon,
    winningRow,
    avoidAnimationIdx,
    userStats,
    isStatsModalOpen,
    openStatsModal,
    closeStatsModal,
    handleUserInput,
    submitGuess,
    addChar,
    deleteChar,
  } = useWordle();

  const onClose = () => {
    closeStatsModal();
  }

  useEffect(() => {
    window.addEventListener('keyup', handleUserInput);

    if (gameOver) {
      window.removeEventListener('keyup', handleUserInput);
    }

    return () => {
      window.removeEventListener('keyup', handleUserInput);
    }
  }, [handleUserInput, gameOver])

  const modalStyle = (darkMode ? {
      '--modal-overlay-bg-color': '#222222',
      '--modal-bg-color': '#101010',
      '--modal-ft-color': '#f7f7f7',
    } : {
      '--modal-overlay-bg-color': '#101010',
      '--modal-bg-color': '#f7f7f7',
      '--modal-ft-color': '#101010',
    }) as React.CSSProperties

  const statsColors = darkMode ? {
    barColor: '#777d7e',
    fontColor: '#f7f7f7'
  } : {
    barColor: '#adb5bd',
    fontColor: '#101010'
  }

  useEffect(() => {
    // App triggered modal open
    if (appTriggerModal) {
      openStatsModal();
    }
  }, [appTriggerModal]);

  useEffect(() => {
    setAppTriggerModal(isStatsModalOpen);
  }, [isStatsModalOpen]);

  return (
    <div className="Wordle">
      <div className="Wordle__body">
        <div className="Wordle__body-grid">
          {grid.map((cells, rowIdx) =>
            <Row
              key={`row-${rowIdx}`}
              cells={cells}
              rowIdx={rowIdx}
              shakeRow={guessIndex === rowIdx && shakeRow}
              gameWon={gameWon}
              winningRow={winningRow}
              avoidAnimation={rowIdx < guessIndex && (gameWon ? rowIdx < avoidAnimationIdx : rowIdx <= avoidAnimationIdx)}
              isSubmitted={rowIdx < guessIndex}
            />
          )}
        </div>

        <div className="Wordle__body-keyboard">
          <Keyboard
            keyboardKeys={keyboardKeys}
            submitGuess={submitGuess}
            addChar={addChar}
            deleteChar={deleteChar}
          />
        </div>

        <Modal isOpen={isStatsModalOpen} onClose={onClose} modalStyle={modalStyle}>
          <>
            <Stats userStats={userStats} colors={statsColors} />
          </>
        </Modal>
      </div>
    </div>
  );
}

