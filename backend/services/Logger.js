class Logger {
    static info(message) {
        console.log('Info:', message)
    }

    static error(message, err) {
        console.error('Error:', message, err)
    }

    static warn(message) {
        console.warn('Warn:', message)
    }
}

module.exports = Logger;