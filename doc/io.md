IO
==

```javascript
import {tap, o, pipe} from 'ramda';
var 
   beautifyCpuOut = map(t => `${(t / 1.0e+6).toExponential()} sec`),
   cpu = of(process.cpuUsage),
   getDeltaCpu = previous => of(() => process.cpuUsage(previous));

pipe(
   () => cpu, 
   map(tap(o(console.log, beautifyCpuOut))), 
   chain(cpuOut => getDeltaCpu(cpuOut)), 
   map(beautifyCpuOut), 
   run
)();
// -> { user: '4.923326e+0 sec', system: '1.297826e+0 sec' }
// -> { user: '2.34e-4 sec', system: '2.1e-5 sec' }
```