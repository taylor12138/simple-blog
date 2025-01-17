// For Solid
/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";

export default function AComponent() {
  const [count, setCount] = createSignal(0);

  return (
        <div class="x-three-year" onClick={() => {
            console.log('click');
            setCount((pre: any) => pre + 1)
        }}>
            <div class="no-open">你有个蛋糕店待开业</div>
            <div class="no-open" style={{ color: 'blue' }}>{`当前count: ${count()}`}</div>
        </div>
  );
}