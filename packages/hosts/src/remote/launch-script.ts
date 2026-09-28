/* @layer core @kind logic */
import type { LaunchPlan } from './session-scripts.type';
import { shellJoin } from './shell-join';
import { shellQuote } from './shell-quote';
import { enterDir } from './enter-dir';
import { HEREDOC, RUN_FILE } from './session-scripts.constants';

const serverCommand = ({ layout, python, args }: LaunchPlan) => {
  const run = shellJoin([python, '-u', layout.multiServer, layout.zip, ...args]);
  return `${enterDir(layout)}; umask 077; echo $$ > server.pid; exec ${run} 0<>console >server.log 2>&1`;
};

const launchScript = (plan: LaunchPlan) => {
  const { layout, systemd } = plan;
  const script = shellQuote(`${layout.dir}/${RUN_FILE}`);
  const detach = systemd
    ? `systemctl --user reset-failed ${layout.unit} 2>/dev/null; systemd-run --user --collect --quiet --unit=${layout.unit} --working-directory=${shellQuote(layout.dir)} sh ${script}`
    : `nohup setsid sh ${script} >/dev/null 2>&1 </dev/null &`;
  return [enterDir(layout), 'umask 077', 'mkfifo -m 600 console', `cat > ${RUN_FILE} <<'${HEREDOC}'`, serverCommand(plan), HEREDOC, detach].join('\n');
};

export { launchScript };
