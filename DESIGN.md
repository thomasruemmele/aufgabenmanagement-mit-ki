---
name: Meine Aufgaben
description: A simple, private task workspace inspired by Apple Notes.
colors:
  bg: "#1c1c1e"
  sidebar: "#252527"
  surface: "#2c2c2e"
  hover: "#333336"
  line: "#414144"
  ink: "#f5f5f7"
  muted: "#aaaab0"
  accent: "#ffd45c"
  selected: "#4a4026"
  danger: "#ff9994"
  input: "#303033"
  light-bg: "#fffefb"
  light-sidebar: "#f2f1ed"
  light-surface: "#f7f6f2"
  light-hover: "#e9e7e1"
  light-line: "#d9d7d0"
  light-ink: "#242424"
  light-muted: "#656560"
  light-accent: "#805900"
  light-selected: "#f0dfb1"
  light-danger: "#aa2422"
  light-input: "#eeede8"
typography:
  headline: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "clamp(30px, 3.1vw, 42px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.035em"}
  detail-title: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "24px", fontWeight: 650, lineHeight: 1.35, letterSpacing: "-0.025em"}
  task-title: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "17px", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.012em"}
  body: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "15px", fontWeight: 400}
  supporting: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: 1.6}
  label: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "12px", fontWeight: 650}
  button: {fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "13px", fontWeight: 600, lineHeight: 1.5}
rounded:
  compact: "6px"
  row: "7px"
  control: "8px"
  toast: "9px"
  menu: "10px"
  circle: "50%"
spacing:
  xs: "5px"
  sm: "8px"
  compact: "10px"
  md: "12px"
  control: "16px"
  group: "22px"
  pane: "26px"
components:
  button-primary: {backgroundColor: "{colors.accent}", textColor: "{colors.bg}", typography: "{typography.button}", rounded: "{rounded.control}", padding: "11px 16px"}
  button-secondary: {backgroundColor: "{colors.surface}", textColor: "{colors.accent}", typography: "{typography.button}", rounded: "{rounded.control}", padding: "11px 16px"}
  button-secondary-hover: {backgroundColor: "{colors.hover}", textColor: "{colors.accent}"}
  button-icon: {textColor: "{colors.muted}", rounded: "{rounded.compact}", padding: "5px"}
  button-text: {textColor: "{colors.accent}", padding: "7px 0"}
  search: {backgroundColor: "{colors.input}", textColor: "{colors.muted}", rounded: "{rounded.control}", padding: "0 11px", height: "37px"}
  navigation-item: {textColor: "{colors.ink}", rounded: "{rounded.row}", padding: "8px 12px"}
  navigation-item-selected: {backgroundColor: "{colors.selected}", textColor: "{colors.ink}"}
  task-row: {textColor: "{colors.ink}", padding: "18px 3px 15px"}
  task-checkbox: {textColor: "{colors.bg}", rounded: "{rounded.circle}", size: "22px"}
  task-checkbox-completed: {backgroundColor: "{colors.accent}", textColor: "{colors.bg}"}
  field: {backgroundColor: "{colors.input}", textColor: "{colors.ink}", rounded: "{rounded.row}", padding: "9px 10px"}
  action-menu: {backgroundColor: "{colors.surface}", textColor: "{colors.ink}", rounded: "{rounded.menu}", padding: "5px", width: "230px"}
---

# Design System: Meine Aufgaben

## Overview

**Creative North Star: "Apple Notes inspired task workspace"**

A quiet, practical workspace for personal daily tasks. The user's explicit Apple Notes reference establishes the system font, dark default, flat lists, and visible completion controls. German labels and familiar list behavior keep attention on the task.

Navigation, the current list, and an optional inspector form one continuous workspace. Task notes and metadata open without leaving the list. Light mode carries the same hierarchy and layout.

**Key Characteristics:**
- Flat task rows with circular completion controls and fine separators.
- Warm yellow actions against restrained dark neutrals.
- One system font, with task titles as the main reading rhythm.
- Persistent desktop navigation and focused phone editors.
- No shipping raster imagery or decorative dashboard cards.

## Colors

The frontmatter records the actual dark and light theme values. The stylesheet switches the same semantic custom properties between themes.

### Primary

- **Warm Yellow / Warm Ochre** (`accent`, `light-accent`): actions, outline icons, focus outlines, completion controls, and filled save buttons.

### Neutral

- **Canvas** (`bg`, `light-bg`): main list and inspector; contrasting text on primary buttons.
- **Sidebar Ground** (`sidebar`, `light-sidebar`): navigation column.
- **Secondary Surface** (`surface`, `light-surface`): selected task rows, secondary buttons, menus, and toasts.
- **Hover Surface** (`hover`, `light-hover`): pointer feedback.
- **Fine Separator** (`line`, `light-line`): row rules, pane boundaries, borders, and scrollbars.
- **Primary Ink** (`ink`, `light-ink`): task titles, headings, and field contents.
- **Supporting Ink** (`muted`, `light-muted`): metadata, note previews, counts, and labels.
- **Selected Navigation** (`selected`, `light-selected`): active navigation and text selection.
- **Input Ground** (`input`, `light-input`): search and form fields.
- **Destructive / Overdue Ink** (`danger`, `light-danger`): destructive actions, overdue dates, and error feedback; a semantic state color.

**The Shared Roles Rule.** Theme changes replace semantic colors while preserving component hierarchy and layout.

## Typography

**Display and Body Font:** the platform system stack in the frontmatter. No custom or remote font is required.

- **Headline:** fluid current-view title; fixed at (35px) on phones.
- **Detail Title:** editable task title; increases to (27px) on phones.
- **Task Title:** the repeated list reading size; long titles wrap.
- **Body:** inherited interface baseline for navigation and ordinary controls.
- **Supporting:** note previews and explanations. Row previews truncate to one line; full notes stay in the inspector.
- **Label:** group headings and field labels. Counts use tabular numerals.
- **Button:** explicit save and secondary actions; unfilled text actions use regular weight.

Phone detail fields increase to (16px), and help copy increases to (14px). Preserve these mobile overrides when extending forms.

## Layout

The desktop shell is a full-height grid. The default sidebar is (260px); list content is fluid, limited to (1100px), with horizontal padding `clamp(30px, 5vw, 78px)`.

With the inspector open, the normal columns are (244px), a task column of at least (320px), and (350px). At widths of at least (1400px), they become (260px), at least (400px), and (370px). Up to (1100px), they contract to (220px), at least (280px), and (320px). These observed values supersede the preliminary inspector estimate.

Up to (900px), navigation is (230px) and the inspector overlays the right side at up to (420px), bounded by the available space beside navigation. Up to (650px), the shell becomes one column: navigation slides in at `min(300px, 86vw)` with a scrim, and the inspector fills the viewport. Hidden navigation and the obscured main pane are removed from visibility. The sidebar toggle appears only on phones.

Task rows have a minimum height of (76px) with independent completion and detail targets. Phone list padding is (25px) horizontally. Inspector field groups use a (22px) gap. Safe-area insets protect mobile headers and sticky save actions.

**The List First Rule.** Routine creation and completion stay in the list; notes and metadata open in the inspector.

## Elevation & Depth

The workspace is flat. Tonal changes and fine separators distinguish panes and rows. Soft shadows appear only on floating menus, toasts, and the intermediate-width overlay inspector; their exact values are in the sidecar. Task rows have no card shadows.

Motion is limited to phone navigation entry, toast entry, and the loading spinner. Reduced-motion preferences disable transitions and animations.

## Shapes

Compact, gently rounded controls use the radius vocabulary in the frontmatter. Completion controls are circular; row separators are straight. Icons are small outline SVGs from the existing Lucide vocabulary.

## Components

### Buttons

Primary buttons use accent fill and canvas ink, with a minimum height of (40px) and a slight brightness increase on hover. Secondary buttons use the secondary surface and accent text, changing to the hover surface. Text actions stay unfilled; destructive actions use danger ink.

Icon buttons have minimum dimensions of (34px), increasing to (38px) on phones. Keyboard focus uses a (2px) accent outline with (3px) offset. Disabled buttons use (45%) opacity.

### Inputs / Fields

Fields use the input ground, primary ink, a transparent (1px) border, supporting placeholders, and an accent caret. Visible labels sit above inspector fields. Search has an outline icon, a transparent inner input, and a container focus-within outline. Quick add stays in the list as an unfilled input with an accent plus and explicit add action.

### Navigation

Full-width rounded rows contain an accent icon, label, and supporting count. The active item uses the selected ground and primary ink; hover uses the hover ground. Time views and personal lists are separate semantic navigation groups. Phone rows have a minimum height of (46px).

### Task Row and Completion

A row contains a circular completion button, flexible text target, and optional metadata. Completion fills the circle, shows a check, and strikes through the title in supporting ink. Selection adds a secondary-surface wash. Desktop rows reveal a detail icon on hover or keyboard focus; task text opens details on every viewport.

Completion and detail controls have distinct, task-specific accessible labels. Completion updates the shared task record and derived views. Completed rows sit behind an explicit show/hide action.

### Inspector, Menus, and Feedback

The inspector reuses the canvas, a sticky toolbar, visible labels, and a clear save action. Phone save actions remain near the bottom safe area. Menus and toasts are compact bordered floating surfaces. Errors use danger ink and border; revision conflicts use an accent border while preserving the draft.

Reminder copy remains beside the field and in help: in-app notices and permitted browser notifications depend on the app being open. A calendar file is offered for closed-app reminders; later calendar changes are managed there. Do not imply guaranteed background delivery.

## Do's and Don'ts

### Do:
- **Do** preserve the explicit Apple Notes reference: system type, dark default, flat lists, and visible completion controls.
- **Do** use semantic colors so both themes retain the same hierarchy.
- **Do** separate task completion from opening details, with task-specific accessible labels.
- **Do** preserve keyboard focus, reduced motion, mobile visibility, and safe-area spacing.
- **Do** keep reminder delivery limits visible where reminders are configured.

### Don't:
- **Don't** replace the list with dashboard cards or decorative imagery.
- **Don't** introduce custom fonts or raster assets without a new user decision.
- **Don't** show a desktop navigation toggle beside persistent navigation.
- **Don't** imply guaranteed reminders while the app is closed.
- **Don't** change a task's visual treatment merely because it appears in another date view.
