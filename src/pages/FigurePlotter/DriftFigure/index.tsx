import React, { useState } from "react";

type Floor = {
  floor: number;
  shearX: number;
  shearY: number;
};

const DriftFigure: React.FC = () => {
  // 初始化 Floor 对象列表
  const [floors, setFloors] = useState<Floor[]>([
    { floor: 1, shearX: 100, shearY: 150 },
    { floor: 2, shearX: 200, shearY: 250 },
    { floor: 3, shearX: 300, shearY: 350 },
  ]);

  // 处理输入值的变化
  const handleInputChange = (
    index: number,
    field: keyof Floor,
    value: number
  ) => {
    const newFloors = [...floors];
    newFloors[index][field] = value;
    setFloors(newFloors);
  };

  return (
    <div className="p-4">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">楼层</th>
            <th className="px-4 py-2">X 剪力</th>
            <th className="px-4 py-2">Y 剪力</th>
          </tr>
        </thead>
        <tbody>
          {floors.map((floor, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={floor.floor}
                  onChange={(e) =>
                    handleInputChange(index, "floor", Number(e.target.value))
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={floor.shearX}
                  onChange={(e) =>
                    handleInputChange(index, "shearX", Number(e.target.value))
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={floor.shearY}
                  onChange={(e) =>
                    handleInputChange(index, "shearY", Number(e.target.value))
                  }
                  className="w-full border p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DriftFigure;
