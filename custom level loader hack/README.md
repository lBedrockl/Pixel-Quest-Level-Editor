# Custom level loader swf by ttBIGGER

## Add a new level (.bin file)

1 - Download the latest version of the Custom level loader hack (`.swf` file) found with this guide.

2 - Download a flash decompiler.
Recommended: [JPEXS Free Flash Decompiler](https://github.com/jindrapetrik/jpexs-decompiler)
This tutorial is using v.20.0.0 for the decompiler, but the most recent version should also work.

3 - Execute the decompiler, click "Open" and select the Custom level loader hack (`.swf`) file.

![open swf](resources/guide/01%20open%20swf.png)

4 - On the left side, expand the `binaryData` and you will see several files named `Level_` and a number. Those are the levels. If you can't see them, you can use the horizontal scroll or drag the lateral dots to expand.

![open binary data](resources/guide/02%20open%20binary%20data.png)

Obs.: Almost all the `Level`s are empty except some sample levels. It may seem daunting at first when you click the `Level_01`, but if you focus on the right side you can actually read the name of the level.

![content showcase](resources/guide/03%20content%20showcase.png)

5 - To add a new level, right click on the `Level_02` and click "Replace". Choose the `.bin` that you downloaded or created using the level editor.

![replace](resources/guide/04%20replace%2002.png)

6 - The `Level` that you replaced will be in bold, denoting that it has unsaved changes. Click the "Save" button.

![save](resources/guide/05%20save.png)

7 - All done! Now you can open the `.swf` file with the Flash Player found [here](resources/) and the new level will be playable. You can have up to 99 levels at the same time.

![new level](resources/guide/06%20new%20level.png)

## Removing a level

One way to remove a level is by replacing it with a new one following the steps above.

If you want to remove a level entirely, you can replace it with an empty `.bin` file following the steps above. For your convenience, one such file is already created [here](resources/).
You know the level is empty when you select it and nothing is shown on the right side of the decompiler screen.

Remember to save!

![remove](resources/guide/07%20remove.png)

If you added a second level, and then remove the first one, in-game you will see something like this:

![new level go first](resources/guide/08%20new%20level%20go%20first.png)

The level number showing in-game is `01` even though you are using the `Level_02`. That's because the hack skips all empty levels. They don't need to start at `Level_01` and they don't need to stay consecutive. If you replace `Level_09` with a new level, in-game the numbers will adjust automatically.

![level skip](resources/guide/09%20level%20skip.png)

## Sample levels

For your convenience, the sample levels are already extracted [here](resources/sample_levels).
