// Raw lucide SVGs inlined at build time by Vite (?raw). Same icon set the old
// Vue site used via lucide-vue-next — now with zero client JS.
import arrowRight from 'lucide-static/icons/arrow-right.svg?raw';
import arrowUpRight from 'lucide-static/icons/arrow-up-right.svg?raw';
import brain from 'lucide-static/icons/brain.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import code2 from 'lucide-static/icons/code-2.svg?raw';
import cpu from 'lucide-static/icons/cpu.svg?raw';
import database from 'lucide-static/icons/database.svg?raw';
import dollarSign from 'lucide-static/icons/dollar-sign.svg?raw';
import gitMerge from 'lucide-static/icons/git-merge.svg?raw';
import layers from 'lucide-static/icons/layers.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import rocket from 'lucide-static/icons/rocket.svg?raw';
import server from 'lucide-static/icons/server.svg?raw';
import shieldCheck from 'lucide-static/icons/shield-check.svg?raw';
import target from 'lucide-static/icons/target.svg?raw';
import users from 'lucide-static/icons/users.svg?raw';
import zap from 'lucide-static/icons/zap.svg?raw';

const icons = {
	'arrow-right': arrowRight,
	'arrow-up-right': arrowUpRight,
	brain,
	check,
	'code-2': code2,
	cpu,
	database,
	'dollar-sign': dollarSign,
	'git-merge': gitMerge,
	layers,
	mail,
	rocket,
	server,
	'shield-check': shieldCheck,
	target,
	users,
	zap,
} as const;

export type IconName = keyof typeof icons;
export default icons;
