# Migrating to 2.2.0

<strong>The new version of "discord-moderation" contains breaking changes that You should know.</strong>

<ul>
    <li><strong>1. There's no more "mute()", "warn()" methods in Moderation class, they're gone into their managers.</strong></li>
    <li><strong>2. There's new Systems Manager with Per Guild Configuration. It means that every guild can have their own enabled systems.</strong></li>
    <li><strong>3. Not major but there's finally fixed typings for this module!</strong></li>
</ul>

```diff
- <Moderation>#mute(...)
+ <Moderation>#mutes#create(...)

- <Moderation>#warn(...)
+ <Moderation>#warns#create(...)

+ <Moderation>#lockdown(...)
+ <Moderation>#unlock(...)
```

<style>
    ul {
        margin-left: 0;
        padding-left: 0;
    }

    ul > li {
        list-style-type: none;
    }
</style>
