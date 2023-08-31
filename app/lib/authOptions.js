import CredentialsProvider from "next-auth/providers/credentials";
import { getUser, login } from "./user"

const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                const user = await login(credentials.username, credentials.password)

                // If no error and we have user data, return it
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 6 * 60 * 60
    },
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.username = token.username
                session.user.role = token.role
                session.user.studentClassId = token.studentClassId
            }

            return session
        },
        async jwt({ token, user, account }) {
            let dbUser = null

            if (account) {
                dbUser = await getUser({ id: account.providerAccountId }, true)
            } else {
                dbUser = await getUser({ username: token.username }, true)
            }            

            if (!dbUser) {
                token.id = user._id
                return token
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                username: dbUser.username,
                email: dbUser.email,
                role: dbUser.role,
                studentClassId: dbUser.studentClass
            }
        }
    },
    pages: {
        signIn: '/auth/signin'
    },
    debug: process.env.NODE_ENV === 'development'
}

export default authOptions;