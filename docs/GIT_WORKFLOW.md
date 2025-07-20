# 🔄 Git Workflow for Team Development

## 🎯 Team Git Strategy

### **Branch Protection Rules**
```
main branch:
├── ✅ Require pull request reviews
├── ✅ Require status checks to pass  
├── ✅ Require branches to be up to date
├── ✅ Require conversation resolution
└── ❌ NO direct pushes to main
```

### **Branching Strategy**
```
main                    # Production-ready code
├── feature/auth        # Your authentication work
├── feature/ui-updates  # Colleague's UI work
├── feature/job-search  # Future job search feature
└── hotfix/bug-fixes    # Critical bug fixes
```

## 🚀 Standard Workflow

### **1. Starting New Work**
```bash
# Always start from latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ... make changes ...

# Regular commits
git add .
git commit -m "feat: add specific feature"
```

### **2. Preparing for Push**
```bash
# Before pushing, sync with main
git checkout main
git pull origin main
git checkout feature/your-feature-name

# Rebase on latest main (optional but recommended)
git rebase main

# Push feature branch
git push -u origin feature/your-feature-name
```

### **3. Creating Pull Request**
```bash
# On GitHub:
1. Go to repository
2. Click "Compare & pull request"
3. Fill in description:
   - What was built
   - How to test
   - Any breaking changes
4. Request review from team members
5. Wait for approval before merging
```

### **4. After Merge**
```bash
# Clean up local branches
git checkout main
git pull origin main
git branch -d feature/your-feature-name

# Start next feature
git checkout -b feature/next-feature
```

## 📋 Commit Message Standards

### **Format**
```
type(scope): description

[optional body]

[optional footer]
```

### **Types**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, missing semicolons, etc
refactor: Code restructuring without feature changes
perf:     Performance improvements
test:     Adding or updating tests
chore:    Maintenance tasks
```

### **Examples**
```bash
# Good commit messages
git commit -m "feat(auth): add email OTP verification"
git commit -m "fix(ui): resolve mobile navigation issue"
git commit -m "docs: update API documentation"
git commit -m "refactor(db): optimize user lookup queries"

# Bad commit messages  
git commit -m "fixes"
git commit -m "update stuff"
git commit -m "work in progress"
```

## 🛡️ Conflict Resolution

### **If Conflicts Occur**
```bash
# 1. Fetch latest changes
git fetch origin

# 2. Merge or rebase main into your branch
git checkout feature/your-branch
git merge main
# OR
git rebase main

# 3. Resolve conflicts in files
# Edit files to resolve conflicts
# Remove conflict markers (<<<<<<<, =======, >>>>>>>)

# 4. Complete the merge/rebase
git add .
git commit -m "resolve: merge conflicts with main"

# 5. Push updated branch
git push origin feature/your-branch
```

## 👥 Team Coordination

### **Communication Rules**
```
✅ Announce major changes in team chat
✅ Review pull requests within 24 hours  
✅ Test others' branches before approving
✅ Ask questions if PR is unclear
✅ Coordinate large refactors
```

### **Before Major Changes**
```bash
# Check what others are working on
git fetch origin
git branch -r  # List remote branches

# Communicate with team
"I'm about to push authentication system changes.
Any conflicts with current work?"
```

## 🚨 Emergency Procedures

### **If Someone Pushes Breaking Changes to Main**
```bash
# 1. Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix

# 2. Fix the issue
# ... make fixes ...

# 3. Fast-track merge
git add .
git commit -m "hotfix: resolve production issue"
git push origin hotfix/urgent-fix

# 4. Create emergency PR
# Request immediate review and merge
```

### **If Main Branch Gets Corrupted**
```bash
# 1. Identify last good commit
git log --oneline

# 2. Create recovery branch
git checkout -b recovery/main-fix [last-good-commit-hash]

# 3. Cherry-pick good changes
git cherry-pick [good-commit-hash]

# 4. Coordinate team recovery
```

## 📊 Best Practices Summary

### **✅ DO**
- Create feature branches for all work
- Write descriptive commit messages
- Pull latest main before starting work
- Test changes before pushing
- Review others' code thoroughly
- Communicate breaking changes

### **❌ DON'T**
- Push directly to main branch
- Force push to shared branches
- Commit broken code
- Leave merge conflicts unresolved
- Work on main branch directly
- Ignore CI/CD failures

This workflow ensures clean collaboration and prevents conflicts!