import Sortable from './entry-defaults.js';
import Swap from '../plugins/Swap/index';
import MultiDrag from '../plugins/MultiDrag/index';

Sortable.mount(new Swap());
Sortable.mount(new MultiDrag());

export default Sortable;
