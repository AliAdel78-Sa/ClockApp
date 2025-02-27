Since you're working on front-end projects and will be collaborating with version control, here are the essential Git commands you'll use daily:

### **1. Basic Workflow Commands**

-   `git init` – Initialize a new repository.
-   `git clone <repo-url>` – Clone a repository from GitHub/GitLab.
-   `git status` – Check the status of your working directory.
-   `git add <file>` / `git add .` – Stage changes for commit.
-   `git commit -m "Your message"` – Save staged changes with a message.
-   `git push origin <branch>` – Push commits to the remote branch.
-   `git pull origin <branch>` – Fetch and merge changes from the remote branch.

### **2. Branching & Merging**

-   `git branch` – List branches.
-   `git branch <branch-name>` – Create a new branch.
-   `git checkout <branch-name>` – Switch to another branch.
-   `git switch <branch-name>` – (Alternative to `checkout`) Switch branches.
-   `git merge <branch-name>` – Merge another branch into the current one.

### **3. Undoing Changes**

-   `git reset --soft HEAD~1` – Undo last commit but keep changes staged.
-   `git reset --hard HEAD~1` – Undo last commit and remove changes.
-   `git checkout -- <file>` – Discard changes in a specific file.
-   `git restore <file>` – Alternative to `checkout` for restoring files.
-   `git revert <commit-hash>` – Create a new commit that undoes a previous commit.

### **4. Working with Remote Repositories**

-   `git remote -v` – View remote repository URLs.
-   `git remote add origin <repo-url>` – Connect your local repo to a remote one.
-   `git fetch` – Fetch the latest changes without merging.

### **5. Debugging & Fixing Issues**

-   `git stash` – Temporarily save changes without committing.
-   `git stash pop` – Apply stashed changes.
-   `git log --oneline --graph` – View commit history in a simplified way.
-   `git diff` – View changes before committing.

These are the core Git commands you'll use **every day**. If you're working with teams, you’ll also need to learn about **rebasing** and **resolving merge conflicts** (`git rebase`, `git merge --abort`, `git rebase --abort`).

Let me know if you want a detailed explanation of any of these!
