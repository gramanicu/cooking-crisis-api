/**
 * This folder contains both the caching middleware and caching functions.
 * By convention, every value of the cache will be prefixed with the
 * "target table". If a value is part of the token cache, the key will
 * have "token_cache-" prefix
 */
"use strict"

import Redis from "ioredis"

const redis = new Redis()

export async function routeCacheMiddleware(req, res, next) {
    const key = "route_cache-" + (req.originalUrl || req.url)
    const val = await getJSON(key)

    if (val) {
        res.send(val)
    } else {
        // Cache the values when they are sent as a response
        // Only if the values are
        res.aux_send = res.send
        res.send = async (body) => {
            if (res.statusCode == 200 || res.statusCode == 201) {
                await cacheJSON(key, body, 15)
            }
            res.aux_send(body)
        }
        next()
    }
}

/**
 * Get a value from the cache
 * @param {String} key The key used to search for the stored
 * key-value pair
 * @returns The value, as a string
 */
export async function getValue(key) {
    try {
        const value = await redis.get(key)
        return value
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Get a JSON object from the cache
 * @param {String} key The key used to search for the stored
 * key-value pair
 * @returns The value, as a JSON object
 */
export async function getJSON(key) {
    try {
        const value = await redis.get(key)
        return JSON.parse(value)
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Store a value in the cache
 * @param {String} key The key to store
 * @param {String|Number} value The value to store
 * @param {Number} ttl The "time to live" of the key-value pair (in seconds)
 */
export async function cacheValue(key, value, ttl) {
    try {
        if (ttl) {
            await redis.set(key, value, "ex", ttl)
        } else {
            await redis.set(key, value)
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Store a json object in the cache
 * @param {String} key The key to store
 * @param {Object} json A json object to be stored
 * @param {Number} ttl The "time to live"  of the key-value (in seconds)
 */
export async function cacheJSON(key, json, ttl) {
    try {
        if (ttl) {
            await redis.set(key, JSON.stringify(json), "ex", ttl)
        } else {
            await redis.set(key, JSON.stringify(json))
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Delete a key-value pair from the cache
 * @param {String} key The key of the pair to be removed
 */
export async function removeKey(key) {
    try {
        await redis.del(key)
    } catch (err) {
        throw new Error(err)
    }
}
