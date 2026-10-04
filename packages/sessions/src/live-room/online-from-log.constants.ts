/* @layer core @kind config */

const JOINED = /(.+?) \(Team #\d+\) playing .+ has joined\./;

const LEFT = /(.+?) \(Team #\d+\) has left the game\. Client\([^)]*\), \[(.*)\]\./;

const WATCHER_TAGS = /'(Tracker|TextOnly|HintGame)'/;

const NOTICE = /^.*?Notice \([^)]*\): /;

export { JOINED, LEFT, NOTICE, WATCHER_TAGS };
