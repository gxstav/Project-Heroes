require('dotenv').config()
const jwt = require('jsonwebtoken')
const generateAccessToken = require('../utils/generateAccessToken')
const generateRefreshToken = require('../utils/generateRefreshToken')
const connection = require('../database/connection')

module.exports = {
    async login(request, response) {
        const user = { email, password } = request.body
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        try {
            await connection('token').insert({ refresh: refreshToken })
            response.cookie('x-access-token', accessToken, { httpOnly: true })
            response.cookie('x-refresh-token', refreshToken, { httpOnly: true })
        } catch (error) {
            console.log(error)
        }
        return response.status(200).json({ access_token: accessToken, refresh_token: refreshToken })
    },

    async refresh(request, response) {
        const token = request.headers['x-refresh-token']
        const databaseRefreshToken = await connection('token').where('refresh', token)
            .catch(error => console.log(error))

        if (!databaseRefreshToken) return response.sendStatus(403)

        jwt.verify(token, process.env.SECRET_TOKEN_REFRESH, (error, data) => {
            if (error) return response.sendStatus(403)
            const user = { email, password } = data
            const newAccessToken = generateAccessToken(user)
            response.status(200).json({ access_token: newAccessToken })
        })

    },

    async logout(request, response) {
        const token = request.headers['x-refresh-token']
        try {
            await connection('token').where('refresh', token).del()
        } catch (error) {
            console.log(error)
        }
        return response.sendStatus(200)
    },

    authenticate(request, response, next) {
        const token = request.headers['x-access-token']
        if (!token) return response.sendStatus(401)

        jwt.verify(token, process.env.SECRET_TOKEN_ACCESS, (error, user) => {
            if (error) return response.sendStatus(403)
            response.user = user
            next()
        })
    }
}