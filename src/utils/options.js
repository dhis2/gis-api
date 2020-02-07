const optionNames = {
    scrollZoom: 'scrollWheelZoom',
}

const translateOptions = (options = {}) =>
    Object.keys(options).reduce((o, key) => {
        o[optionNames[key] || key] = options[key]
        return o
    }, {})

export default translateOptions
