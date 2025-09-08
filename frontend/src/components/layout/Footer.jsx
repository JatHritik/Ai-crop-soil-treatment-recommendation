import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white">
      <div className="container-nature">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-nature rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Soil Analysis</span>
            </div>
            <p className="text-ink-300 text-sm leading-relaxed">
              AI-powered soil analysis and crop treatment recommendations for sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-ink-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-ink-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-ink-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-ink-300 hover:text-white transition-colors duration-200">
                  API
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-ink-300 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Status
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-ink-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-ink-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-ink-400 text-sm">
              © 2024 Soil Analysis Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms" className="text-ink-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-ink-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-ink-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
