import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      })
    } else if (!isLogin) {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            My IEP Hero
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to access your IEP tools' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Accounts Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Accounts Available:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Parent:</strong> parent@demo.com</div>
              <div><strong>Advocate:</strong> advocate@demo.com</div>
              <div><strong>Password:</strong> demo123</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>
          
          {/* Quick Demo Login Buttons */}
          <div className="mt-4 space-y-2">
            <div className="text-center text-sm text-gray-500 mb-3">Quick Demo Login:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail('parent@demo.com')
                  setPassword('demo123')
                }}
                disabled={loading}
              >
                Parent Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail('advocate@demo.com')
                  setPassword('demo123')
                }}
                disabled={loading}
              >
                Advocate Demo
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}