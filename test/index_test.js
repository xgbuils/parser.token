var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
var ParserToken = require('../src/')
var sinon = require('sinon')

describe('ParserToken', function () {
    describe('.next', function () {
        var cb
        var next
        var validStatus
        beforeEach(function () {
            next = sinon.stub()
            cb = sinon.stub()
            validStatus = 'VALID_STATUS'
        })
        describe('given a next callback', function () {
            
            context('if it is passed a valid status', function () {
                it('calls once the callback passed in next method', function () {
                    var parserToken = new ParserToken({}, [
                        validStatus
                    ], next)
                    parserToken.next(validStatus, [], cb)
                    assert(cb.calledOnce, cb.printf('cb must be called once but called %c'))
                })

                it('calls the callback with value returned by third callback parameter of constructor', function () {
                    var parserToken = new ParserToken({}, [
                        validStatus
                    ], next)
                    parserToken.next(validStatus, [], cb)
                    assert(next.calledOnce, next.printf('Next must be called once but called %c'))
                })

                it('calls the callback with value returned by third callback parameter of constructor', function () {
                    var nextStatus = 'NEXT_STATUS'
                    next.returns(nextStatus)
                    var parserToken = new ParserToken({}, [
                        validStatus
                    ], next)
                    parserToken.next(validStatus, [], cb)
                    assert(cb.calledWith(nextStatus), cb.printf('Expected stub with name `cb` called: %C'))
                })
            })

            context('if it is passed an invalid status', function () {
                it('throws a ParserTokenError', function () {
                    var invalidStatus = 'INVALID_STATUS'
                    var key = 'foo'
                    var column = 8
                    function test () {
                        var parserToken = new ParserToken({
                            key: key,
                            column: column
                        }, [
                            validStatus
                        ], next)
                        parserToken.next(invalidStatus, [], cb)
                    }
                    expect(test).to.throw('Unexpected token `' + key + '` in column ' + column + '.')
                })
            })
        })

        describe('if next callback is not passed', function () {
            it('throws a ParserTokenError', function () {
                function test () {
                    var parserToken = new ParserToken({}, [
                        validStatus
                    ])
                    parserToken.next(validStatus, [], cb)
                }
                expect(test).to.throw('`next` callback parameter must be defined.')
            })
        })
    })

    describe('.bind', function () {
        context('if is passed and status object to bind', function () {
            it('parser token has this reference in parserStatus property', function () {
                var parserStatus = {}
                var token = new ParserToken({})
                token.bind(parserStatus)
                expect(token.parserStatus).to.be.equal(parserStatus)
            })
        })
    })
})
