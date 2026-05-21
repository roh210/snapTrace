import {describe,test,expect} from 'vitest'
import { encodeBase62 } from './base62'

describe('Tests for base62 encoding', () => {
    test('encodes 123456 to 000W7E', () =>{
        expect(encodeBase62(123456)).toBe('000W7E')
    })
    test('encoding of 123456 returns an encoding of len 6', () =>{
        expect(encodeBase62(123456)).toHaveLength(6)
    })
    test('encodes 0 to 000000', () =>{
        expect(encodeBase62(0)).toBe('000000')
    })
})
