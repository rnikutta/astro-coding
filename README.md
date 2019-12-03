# astro-coding
CSDC-wide astro coding hacks (and botches)

## Contributing

Contributions are welcome! Please develop your project in a separate
branch:

```
git checkout -b my-project-branch
```

Once you'd like your project to be included in the `master` branch of
the repository, push your work to GitHub and create a pull request.

In order to create your project branch on GitHub, you may need to run:

```
git push --set-upstream origin my-project-branch
```

You can review and accept the pull request yourself.


If at some point you need to update your local branch `yourbranch` with content from the `master` branch, do:

1. Be on your local branch: `git checkout yourbranch`

  And make sure your branch is committed (i.e. has no staged or unstaged changes).

2. Gets new stuff from Github, but doesn't merge yet: `git fetch origin`

3. Merge the fetched changes from `master` to your local branch: ```git merge origin/master```

   The last step mans: "Take the changes from `origin/master` that I just
   fetched, and merge them into my branch that I'm on right now." This
   is implicit, since you're not giving the branch to merge into; just
   being on the local `yourbranch` provides the target here.

---
_Version: 20191203_
