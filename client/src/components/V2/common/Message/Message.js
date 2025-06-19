import { createVNode, render } from 'vue'
import Message from './Message.vue'

const message = (text, type = 'info', second = 3000) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vm = createVNode(Message, { text, type, second })
    render(vm, container)

    setTimeout(() => {
        render(null, container)
        setTimeout(() => {
            document.body.removeChild(container)
        }, 300)
    }, second + 1000)
}

export default message