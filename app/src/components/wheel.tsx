import React, { FC, useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

function DissectValues(value: number): [number, number, number] {
  return ("" + value)
    .padStart(3, "0")
    .split("")
    .map((v) => parseInt(v)) as [number, number, number];
}

export const Wheel: FC<{ value: number }> = ({ value }) => {
  const [values, setValues] = useState<[number, number, number]>(
    DissectValues(value)
  );
  const [rotations, setRotations] = useState(0);
  const [showResult, setShowResult] = useState(value > 0);
  useEffect(() => {
    setShowResult(false);
    setValues(DissectValues(value));
    if (value === 0) {
      return () => false;
    }
    setRotations(rotations + 1);
    const timeout = setTimeout(() => {
      setShowResult(true);
    }, 9000);
    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <div className="flex flex-row items-center">
      {new Array(3).fill(null).map((_, dec) => {
        const segments = dec === 0 ? 3 : 10;
        const segmentPercentage = 1 / segments;
        const rotationsBeforeStop = dec * 3 + 3;
        return (
          <div
            key={dec}
            className="relative flex flex-col items-center pt-4 px-4"
          >
            <div className="w-2 h-8 left-1/2 bg-white absolute top-0 z-10" />
            <PieChart
              className="z-0"
              labelStyle={(d) => ({
                fill: "#fff"
                // transform: `rotate(${(d / (dec === 0 ? 3 : 10)) * 360}deg)`
              })}
              style={{
                transition: `transform ${rotationsBeforeStop}s ease-out`,
                transform: `rotate(${
                  -90 -
                  (segmentPercentage * 360) / 2 -
                  values[dec] * segmentPercentage * 360 +
                  rotations * 360 * rotationsBeforeStop
                }deg)`
              }}
              label={(labelRenderProps) => labelRenderProps.dataIndex}
              data={new Array(segments).fill(null).map((_, i, arr) => ({
                title: i,
                value: 1,
                color: `#${new Array(3)
                  .fill(`${20 + i * Math.floor(80 / arr.length)}`)
                  .join("")}`
              }))}
            />
          </div>
        );
      })}
      <h1 className="text text-5xl w-32">{showResult ? ` = ${value}` : " "}</h1>
    </div>
  );
};
