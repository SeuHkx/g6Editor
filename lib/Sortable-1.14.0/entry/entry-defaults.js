import Sortable from '../src/Sortable.js';
import AutoScroll from '../plugins/AutoScroll/index';
import { RemoveOnSpill, RevertOnSpill } from '../plugins/OnSpill/index';
// Extra
import Swap from '../plugins/Swap/index';
import MultiDrag from '../plugins/MultiDrag/index';

Sortable.mount(new AutoScroll());
Sortable.mount(RemoveOnSpill, RevertOnSpill);

export default Sortable;

export {
	Sortable,

	// Extra
	Swap,
	MultiDrag
};
