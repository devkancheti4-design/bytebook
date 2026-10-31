=== linux-command-line | The Linux Command Line
unit: Developer Tools
desc: Work like a developer in the terminal: the file system tree, navigating and managing files, viewing and searching text, permissions, pipes and redirection, processes and compiling code.

Servers, cloud machines, Raspberry Pis and most developer tools run Linux, and they are driven from the **command line** (also called the terminal or shell). It is faster than clicking once you know a few dozen commands — and in internships you will be expected to use it.

The program that reads your commands is the **shell** (usually **bash** or **zsh**). On Windows, install **WSL** (Windows Subsystem for Linux) to get a real Linux shell; macOS already has a Unix shell.

## The file system

Linux organises everything in **one tree** starting at the **root**, `/`:

:::diagram tree
tree: /(home(asha(projects,notes.txt)),etc,bin,usr,tmp)
shape: box
caption: Part of a Linux directory tree. Asha's home folder is /home/asha, also written ~.
:::

| Path | Meaning |
|---|---|
| `/` | the root of the whole tree |
| `~` | your home folder, e.g. `/home/asha` |
| `.` | the current folder |
| `..` | the parent folder |
| `/home/asha/notes.txt` | an **absolute** path (starts at `/`) |
| `projects/lab1.c` | a **relative** path (starts at the current folder) |

## Navigating

```bash
pwd                     # print working directory: where am I?
ls                      # list files
ls -la                  # long format, including hidden files (names starting with .)
cd projects             # change into a folder
cd ..                   # go up one level
cd ~                    # go home (plain `cd` does the same)
cd -                    # go back to the previous folder
```

:::tip Tab completion and history
Press **Tab** to auto-complete file and command names. Press **↑** to recall previous commands, and **Ctrl+R** to search your history.
:::

## Managing files and folders

```bash
mkdir lab1                      # make a folder
mkdir -p cse101/week2/day3      # make nested folders at once
touch main.c                    # create an empty file
cp main.c backup.c              # copy
cp -r lab1 lab1-backup          # copy a folder recursively
mv backup.c old/                # move into a folder
mv draft.txt final.txt          # rename
rm old.txt                      # delete a file (no recycle bin!)
rm -r lab1-backup               # delete a folder and everything inside
```

:::warn rm is permanent
There is no undo. Double-check before `rm -r`, and never run commands like `rm -rf /` that you find online without understanding them.
:::

## Viewing and searching text

```bash
cat notes.txt                   # print a whole file
less big.log                    # scroll through a long file (q to quit)
head -n 5 data.csv              # first 5 lines
tail -n 20 server.log           # last 20 lines
tail -f server.log              # follow a growing file live
wc -l *.c                       # count lines in every .c file
grep "main" *.c                 # find lines containing "main"
grep -rn "TODO" src/            # search recursively, with line numbers
find . -name "*.py"             # find files by name
```

## Pipes and redirection

Linux commands are small tools that you **combine**:

| Symbol | Meaning | Example |
|---|---|---|
| `>` | write output to a file (overwrite) | `ls > files.txt` |
| `>>` | append output to a file | `echo "done" >> log.txt` |
| `<` | read input from a file | `./a.out < input.txt` |
| `\|` | pipe one command's output into the next | `cat log.txt \| grep ERROR \| wc -l` |

```bash
history | grep gcc | tail -n 3          # my last 3 gcc commands
ls -l | sort -k5 -n | tail -n 1          # the largest file in this folder
./marks < test1.txt > result1.txt       # test a program with saved input
```

## Permissions

`ls -l` shows a permission string like `-rwxr-xr--`: the file type, then **read/write/execute** for the **owner**, the **group** and **others**.

```bash
chmod +x script.sh              # make a script executable
chmod 644 notes.txt             # rw- r-- r-- (6 = 4+2, 4 = read)
sudo apt install gcc            # run one command as the administrator (root)
```

| Digit | Permissions |
|---|---|
| 7 | rwx (4 + 2 + 1) |
| 6 | rw- |
| 5 | r-x |
| 4 | r-- |

## Processes

```bash
ps aux | grep python            # list running processes
top                             # live view of CPU and memory use (q to quit)
kill 4321                       # stop process 4321
./server &                      # run in the background
Ctrl+C                          # stop the program running in the terminal
```

## Compiling and running from the terminal

```bash
gcc -Wall -o hello hello.c && ./hello          # C: compile, then run only if it compiled
g++ -std=c++17 -o app main.cpp && ./app         # C++
python3 script.py                               # Python
./hello < input.txt                             # feed input from a file
```

## Command cheat sheet

| Task | Command |
|---|---|
| Where am I / what's here | `pwd`, `ls -la` |
| Move around | `cd folder`, `cd ..`, `cd ~` |
| Create | `mkdir`, `touch` |
| Copy / move / delete | `cp`, `mv`, `rm` (`-r` for folders) |
| Read files | `cat`, `less`, `head`, `tail` |
| Search | `grep`, `find` |
| Help | `man ls`, `ls --help` |
| Install software (Ubuntu) | `sudo apt install name` |
| Download | `curl -O url`, `wget url` |

:::quiz
Q. Which command shows the folder you are currently in?
* `pwd`
- `ls`
- `cd`
- `whoami`
= pwd means "print working directory".

Q. What does `cd ..` do?
- Goes to the home folder
* Moves to the parent folder
- Lists hidden files
- Deletes the folder
= `..` always refers to the parent directory.

Q. What does `ls | wc -l` print?
- The size of every file
* The number of entries in the current folder
- The longest file name
- Nothing
= `ls` lists one entry per line when piped, and `wc -l` counts lines.

Q. Which permission number gives the owner read, write and execute, and everyone else only read?
- 777
- 755
* 744
- 644
= 7 = rwx for the owner, 4 = r-- for group and others.
:::

=== git-github | Git & GitHub
desc: Version control for every project: repositories, the staging area, commits, history, branches and merging, and sharing work on GitHub with push, pull, clones and pull requests.

**Git** is a **version control system**: it records snapshots of your project over time so you can see what changed, go back to any earlier version, and work with others without overwriting each other's work. **GitHub** is a website that hosts Git repositories online — and doubles as your public developer portfolio.

## Why version control?

- **Never lose work** — every commit is a restore point.
- **Understand history** — who changed what, when, and why.
- **Experiment safely** — try ideas on a branch; throw them away if they fail.
- **Collaborate** — many people work on one codebase in parallel.

## The three areas

| Area | What lives there |
|---|---|
| **Working directory** | the files you are editing right now |
| **Staging area** (index) | changes you have marked for the next commit |
| **Repository** (`.git` folder) | the permanent history of commits |

:::diagram flow
start: Edit files in the working directory
process: git add — stage the changes you want
process: git commit — save a snapshot with a message
process: git push — upload commits to GitHub
end: Teammates git pull to get them
caption: The everyday Git workflow.
:::

## First-time setup

```bash
git config --global user.name "Asha Rao"
git config --global user.email "asha@example.com"
git config --global init.defaultBranch main
```

## Starting and saving work

```bash
git init                          # turn the current folder into a repository
git status                        # what changed? what is staged?
git add main.c                    # stage one file
git add .                         # stage everything in this folder
git commit -m "Add linked list insert and delete"
git log --oneline                 # history, one line per commit
git diff                          # unstaged changes, line by line
```

:::tip Good commit messages
Write the message in the imperative mood and describe **why**, briefly: "Fix off-by-one in binary search", not "changes" or "final final 2". Commit small, logical steps.
:::

## .gitignore

List files Git should never track — compiled programs, secrets, editor clutter:

```text
# .gitignore
a.out
*.o
*.exe
__pycache__/
.env
node_modules/
.vscode/
```

## Undoing things

```bash
git restore main.c                # discard unstaged edits to a file
git restore --staged main.c       # unstage, keeping the edits
git commit --amend                # fix the last commit's message or contents
git revert a1b2c3d                # make a new commit that undoes an old one
git checkout a1b2c3d -- notes.txt # bring back an old version of one file
```

## Branches

A **branch** is an independent line of development. `main` holds working code; you create a branch for each feature or fix, then **merge** it back.

```bash
git branch                        # list branches
git switch -c feature/stack       # create and switch to a new branch
# ... edit and commit on the branch ...
git switch main                   # go back to main
git merge feature/stack           # bring the branch's commits into main
git branch -d feature/stack       # delete the merged branch
```

If both branches changed the same lines, Git reports a **merge conflict** and marks the file:

```text
<<<<<<< HEAD
printf("Hello\n");
=======
printf("Hello, world!\n");
>>>>>>> feature/greeting
```

Edit the file to keep the right version, delete the markers, then `git add` and `git commit`.

## Working with GitHub

```bash
git clone https://github.com/user/repo.git      # download a repository
git remote add origin https://github.com/you/project.git
git push -u origin main                          # upload your commits (first time)
git push                                         # later pushes
git pull                                         # fetch and merge others' changes
```

**Pull requests (PRs)**: on GitHub, push your branch, then open a pull request asking to merge it into `main`. Teammates review the changes and comment before merging — the standard workflow in every software company.

**Forks**: copy someone else's repository to your account, change it, then open a PR back to the original — how open-source contributions work.

| Command | Purpose |
|---|---|
| `git init` / `git clone` | start a repository / copy one |
| `git status`, `git diff`, `git log` | inspect |
| `git add`, `git commit` | save a snapshot |
| `git switch -c`, `git merge` | branch and merge |
| `git push`, `git pull` | sync with GitHub |
| `git restore`, `git revert` | undo |

:::exam Your GitHub is your CV
Recruiters look at GitHub profiles. Keep each project in its own repository with a README (what it does, how to run it, a screenshot), commit regularly, and never commit passwords or API keys.
:::

:::quiz
Q. Which command moves changes into the staging area?
- `git commit`
* `git add`
- `git push`
- `git init`
= `add` stages; `commit` records the staged snapshot.

Q. What does `git push` do?
- Downloads changes from GitHub
* Uploads your local commits to the remote repository
- Creates a new branch
- Deletes old commits
= `pull` downloads; `push` uploads.

Q. Which file tells Git which files to ignore?
- `.gitconfig`
* `.gitignore`
- `README.md`
- `.git/ignore.txt`
= Patterns listed in `.gitignore` are never tracked.

Q. What is a pull request?
* A request on GitHub to review and merge one branch's changes into another
- The `git pull` command
- A request to download a repository
- A bug report
= PRs are how teams review code before merging.
:::
