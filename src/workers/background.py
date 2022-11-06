import asyncio
from collections import defaultdict

from concurrent.futures import ThreadPoolExecutor
from typing import Any


TOTAL_THREADS = 100

class BackgroundThreads:
    def start(self) -> None:
        self.lock: defaultdict = defaultdict(asyncio.Lock)
        self.loop: asyncio.AbstractEventLoop = asyncio.get_running_loop()
        self.executor: ThreadPoolExecutor = ThreadPoolExecutor(TOTAL_THREADS)

    async def run(self, func: Any, *args: Any, **kwargs: Any) -> Any:
        return await self.loop.run_in_executor(self.executor, func, *args, **kwargs)
    
    def close(self) -> None:
        self.executor.shutdown()


background_threads = BackgroundThreads()
