/**
name: Docs
type: documentation
desc: >
    The purpose of this component is to describe the way of writing documentation in source code.

    ###Module

    *name*:
    module name

    *desc*:
    module description, field content will be passed throuth markdown

    *options*:
    object containing data-* attributes in component markup.

    ```
    options:
        analytics: Analytics object
    ```

    *events* and *pubsub*:
    object of events triggered by a component

    *examples*:
    an array of markup examples:

    examples:

    ```
      - name: Grey
        tmpl: >
            <button class="button button--default">Default</button>
      - name: Included
        tmpl:
          include: info.html
    ```

    *modifiers*:
    an object of scss modifiers:

    ```
    modifiers:
      :active: Active state
      .is-active: Simulates an active state on mobile devices
    ```

    ###Function

    *args*:
    an object or array that function accepts

    ```
    args:
        newType: sets type of message
    ```

    this is the simplest case, if you want to use longer description with some code blocks, use the following form:

    ```
    args:
        name: newType
        desc: >
            sets type of message. available options are: `error`, 'info'
    ```

    `desc`: description of a function

*/
module.exports = {
};
