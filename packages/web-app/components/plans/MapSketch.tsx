import { SketchField, Tools } from "@sendou/react-sketch";

interface MapSketchProps {
  sketch: any;
  controlledValue: any;
  onSketchChange: any;
  color: any;
  tool: any;
}

const MapSketch: React.FC<MapSketchProps> = ({
  sketch,
  controlledValue,
  color,
  onSketchChange,
  tool,
}) => {
  return (
    <SketchField
      name="sketch"
      className="canvas-area"
      ref={sketch}
      lineColor={color}
      lineWidth={5}
      width={1127}
      height={634}
      value={controlledValue}
      onChange={onSketchChange}
      tool={tool ?? Tools.Pencil}
      style={{ position: "relative", left: "-27px" }}
    />
  );
};

export default MapSketch;
