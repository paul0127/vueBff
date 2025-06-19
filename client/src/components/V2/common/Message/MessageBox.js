import { createApp, h } from 'vue'
import MessageBox from './MessageBox.vue'

function confirm(message, title = '', options = {}) {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div')
        document.body.appendChild(container)

        const app = createApp({
            render() {
                return h(MessageBox, {
                    title,
                    message,
                    confirmButtonText: options.confirmButtonText || '確認',
                    cancelButtonText: options.cancelButtonText || '取消',
                    type: options.type || 'info',
                    onConfirm: () => {
                        cleanup()
                        resolve()
                    },
                    onCancel: () => {
                        cleanup()
                        reject()
                    },
                })
            },
        })

        function cleanup() {
            app.unmount()
            document.body.removeChild(container)
        }

        app.mount(container)
    })
}

export default {
    confirm,
}

