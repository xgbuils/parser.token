function ParserToken (token, validStatus, next) {
    this.validStatus = validStatus
    this.value = token.value
    this.key = token.key
    this.column = token.column
    this.type = token.type
    this._next = typeof next === 'function' ? next.bind(this) : nextMustBeDefined
}

ParserToken.prototype.next = function (status, values, cb) {
    if (this.validStatus.indexOf(status) !== -1) {
        console.log(typeof this._next)
        var nextStatus = this._next(status, values)
        return cb(nextStatus)
    } else {
        throw new ParserTokenError('Unexpected token `' + this.key +
            '` in column ' + this.column + '.')
    }
}

function nextMustBeDefined () {
    throw new ParserTokenError('`next` callback parameter must be defined.')
}

ParserToken.prototype.bind = function (parserStatus) {
    this.parserStatus = parserStatus
}

function ParserTokenError (message) {
    this.message = message
}

ParserTokenError.prototype = Object.create(Error.prototype)
ParserTokenError.prototype.constructor = ParserTokenError

ParserToken.error = {
    ParserTokenError: ParserTokenError
}

module.exports = ParserToken
