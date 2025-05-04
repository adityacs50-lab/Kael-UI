# Contributing to KAEL UI

Thank you for your interest in contributing to KAEL UI! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Any additional context

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- A clear, descriptive title
- A detailed description of the proposed feature
- Any relevant mockups or examples
- Why this feature would be beneficial

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   pip install flask flask-cors requests pyttsx3
   ```
3. Start the development server:
   ```
   npm start
   ```
4. In a separate terminal, start the backend:
   ```
   python standalone_server.py
   ```

## Style Guidelines

### JavaScript/React
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks

### CSS
- Use Tailwind CSS classes when possible
- Custom CSS should be in appropriate files

### Python
- Follow PEP 8 style guide
- Use docstrings for functions and classes

## Testing

Please ensure your changes don't break existing functionality. Test your changes thoroughly before submitting a pull request.

## License

By contributing to KAEL UI, you agree that your contributions will be licensed under the project's MIT License.