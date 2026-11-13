<script lang="ts">
import "./layout.css";

import { ModeWatcher } from "mode-watcher";

import favicon from "#lib/assets/favicon.svg";
import NotificationsContainer from "#lib/components/ui/NotificationsContainer.svelte";

let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon}></svelte:head>
<ModeWatcher />
<NotificationsContainer />
{@render children()}
