import React from 'react';
import './ScoresProgressCircle.css';

const ScoresProgressCircle = ({ r, cx, cy, strokeWidth, progress }) => {
  const circumference = 2 * 3.14 * r;
  const offset = circumference * ((100 - progress) / 100);
  const getStrokeColor = () => {
    if (progress > 80) return '#19e27a'; // green
    if (progress > 50) return '#fbc02d'; // yellow
    return '#e53935'; // red
  };

  return (
    <div className="segmented-progresscircle">
      <div className="segmented-progresscircle__text">
        {progress}%
      </div>
      <div className="segmented-progresscircle__circles">
        <svg>
          <circle
            r={r}
            cy={cy}
            cx={cx}
            strokeWidth={strokeWidth}
            className="segmented-progresscircle__circles__background-dashes"
          ></circle>
          <circle
            r={r}
            cy={cy}
            cx={cx}
            strokeWidth={strokeWidth}
            stroke={getStrokeColor()}
            className={`segmented-progresscircle__circles__progress-dashes`}
            stroke-dasharray={circumference + 'px'}
            stroke-dashoffset={offset + 'px'}
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default ScoresProgressCircle;