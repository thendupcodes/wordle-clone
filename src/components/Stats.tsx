import { useEffect, useMemo, useState } from "react";

type Stats = {
  games: number,
  wins: number,
  guesses: number,
  guessDistribution: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
  }
}

type StatsProps = {
  userStats: Stats
  colors: {
    barColor: string,
    fontColor: string,
  }
}

export default function Stats ({ userStats, colors }: StatsProps) {
  const [countdown, setCountdown] = useState('');
  const { games, wins, guessDistribution } = userStats || {};
  const { barColor, fontColor } = colors;

  const barMaxHeight = 200;

  const getAndSetCountDown = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const difference = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setCountdown(`${hours}h ${minutes}m ${seconds}s`);
  }

  const [barHeights, barValues]: [number[], number[]]= useMemo(() => {
    if (guessDistribution == null) {
      return [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
    }

    const g1 = guessDistribution[1] || 0;
    const g2 = guessDistribution[2] || 0;
    const g3 = guessDistribution[3] || 0;
    const g4 = guessDistribution[4] || 0;
    const g5 = guessDistribution[5] || 0;
    const g6 = guessDistribution[6] || 0;

    const most = Math.max(g1, g2, g3, g4, g5, g6);

    return [
      [g1, g2, g3, g4, g5, g6].map((g) => Math.floor((g/most) * barMaxHeight)),
      [g1, g2, g3, g4, g5, g6]
    ];
  }, [guessDistribution]);

  useEffect(() => {
    getAndSetCountDown();

    const timer = setInterval(() => {
      getAndSetCountDown();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (userStats == null) return (
    <div className="Stats">
      <div className="Stats__heading">WordleClone</div>

      <div className="Stats__body">Hey wordsmith! Eager to unveil your stats? Finish today's wordle and your stats will be revealed at the end of the challenge. Happy guessing!</div>
    </div>
  );
  
  return (
    <div className="Stats">
      <div className="Stats__heading">WordleClone</div>

      <div className="Stats__body">
        <div className="Stats__body-heading">Statistics</div>

        <div className="Stats__body-items">
          <div className="Stats__body-item">
            <div className="Stats__body-item-value">
              {games}
            </div>

            <div className="Stats__body-item-key">
              Played
            </div>
          </div>

          <div className="Stats__body-item">
            <div className="Stats__body-item-value">
              {wins}
            </div>          

            <div className="Stats__body-item-key">
              Won
            </div>
          </div>

          <div className="Stats__body-item">
            <div className="Stats__body-item-value">
              {(wins / games) * 100}
            </div>                  

            <div className="Stats__body-item-key">
              Win %
            </div>
          </div>
        </div>
      </div>

      <div className="Stats__guesses">
        <div className="Stats__guesses-heading">Guess distribution</div>

        <div className="Stats__guesses-chart">
          <svg width="475" height="300" viewBox="0 0 475 200" style={{ width: '100%', maxWidth: '475px', minHeight: '150px', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y={barMaxHeight - barHeights[0]} width="50" height={barHeights[0]} fill={barColor} />
            <rect x="100" y={barMaxHeight - barHeights[1]} width="50" height={barHeights[1]} fill={barColor} />
            <rect x="175" y={barMaxHeight - barHeights[2]} width="50" height={barHeights[2]} fill={barColor} />
            <rect x="250" y={barMaxHeight - barHeights[3]} width="50" height={barHeights[3]} fill={barColor} />
            <rect x="325" y={barMaxHeight - barHeights[4]} width="50" height={barHeights[4]} fill={barColor} />
            <rect x="400" y={barMaxHeight - barHeights[5]} width="50" height={barHeights[5]} fill={barColor} />

            <text x="50" y={barMaxHeight - barHeights[0] - 10} textAnchor="middle" fill={fontColor}>{barValues[0]}</text>
            <text x="125" y={barMaxHeight - barHeights[1] - 10} textAnchor="middle" fill={fontColor}>{barValues[1]}</text>
            <text x="200" y={barMaxHeight - barHeights[2] - 10} textAnchor="middle" fill={fontColor}>{barValues[2]}</text>
            <text x="275" y={barMaxHeight - barHeights[3] - 10} textAnchor="middle" fill={fontColor}>{barValues[3]}</text>
            <text x="350" y={barMaxHeight - barHeights[4] - 10} textAnchor="middle" fill={fontColor}>{barValues[4]}</text>
            <text x="425" y={barMaxHeight - barHeights[5] - 10} textAnchor="middle" fill={fontColor}>{barValues[5]}</text>

            <text x="50" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">1</text>
            <text x="125" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">2</text>
            <text x="200" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">3</text>
            <text x="275" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">4</text>
            <text x="350" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">5</text>
            <text x="425" y="225" textAnchor="middle" fill={fontColor} fontWeight="bold">6</text>
          </svg>

        </div>
      </div>

      <div className="Stats__next">
        <div className="Stats__next-heading">Next game in</div>

        <div className="Stats__next-body">{countdown}</div>
      </div>
    </div>
  )
}
