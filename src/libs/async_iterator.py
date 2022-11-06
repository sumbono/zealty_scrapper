class CustomIterator:

    def __init__(self, items):
        self.items = items

    def __aiter__(self):
        # create an iterator of the input items
        self.iter_items = iter(self.items)
        return self

    async def __anext__(self):
        try:
            # extract the items one at a time
            k = next(self.iter_items)
        except StopIteration:
            # raise stopasynciteration at the end of iterator
            raise StopAsyncIteration
        # return values for a key
        return k