import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/ToolState";
import "../style/canvas.scss"
import Brush from "../tools/Brush";
import { useParams } from "react-router-dom";
import Rect from "../tools/Rect";
import axios from 'axios'


const Canvas = observer(() => {
    const canvasRef = useRef()
    const [name, setName] = useState('')
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:5000/`);
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                console.log('msg', msg)
                switch (msg.method) {
                    case "connection":
                        console.log(`connected user ${msg.username}`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        console.log('brush')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case "rect":
                Rect.staticDrow(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() }).then(res => console.log(res))
    }

    const connectHandler = (e) => {
        e.preventDefault()
        canvasState.setUsername(name)
        setModal(false)
    }


    return (
        <div className="canvas">
            {modal &&
                <form className="canvas__form" onSubmit={e => connectHandler(e)}>
                    <label htmlFor="user-name">Input name:</label>
                    <input id="user-name" type="text" value={name} onChange={e => setName(e.target.value)} />
                    <button type="submit">Open</button>
                </form>
            }
            <canvas onMouseDown={() => mouseDownandler()} ref={canvasRef} width={600} height={400} />
        </div>
    );
})
export default Canvas;