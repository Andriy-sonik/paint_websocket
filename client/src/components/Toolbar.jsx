import "../style/toolbar.scss"
import canvasState from "../store/canvasState";
import toolState from "../store/ToolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
function Toolbar() {

    const changeColor = (e) => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionid + ".png"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="toolbar">
            <button className="toolbar__btn" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}>brush</button>
            <button className="toolbar__btn" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}>react</button>
            <button className="toolbar__btn">circle</button>
            <button className="toolbar__btn">eraser</button>
            <button className="toolbar__btn">line</button>
            <input className="toolbar__input" type="color" onChange={e => changeColor(e)} />
            <button className="toolbar__btn ml-auto" onClick={() => canvasState.undo()}>undo</button>
            <button className="toolbar__btn" onClick={() => canvasState.redo()}>redo</button>
            <button className="toolbar__btn" onClick={() => download()} >save</button>
        </div>
    );
}

export default Toolbar;